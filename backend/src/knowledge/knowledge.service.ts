import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AiProviderService } from '../ai-provider/ai-provider.service';
import { PDFParse } from 'pdf-parse';

@Injectable()
export class KnowledgeService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private aiProviders: AiProviderService,
  ) {}

  async createBase(tenantId: string, agentId: string, name: string) {
    const agent = await this.prisma.agent.findFirst({ where: { id: agentId, tenantId } });
    if (!agent) throw new NotFoundException('Agent not found.');
    return this.prisma.knowledgeBase.create({ data: { name, agentId, tenantId } });
  }

  async getBases(tenantId: string, agentId: string) {
    return this.prisma.knowledgeBase.findMany({
      where: { agentId, tenantId },
      include: {
        _count: { select: { chunks: true } },
        chunks: { select: { metadata: true, createdAt: true } },
      },
      orderBy: { updatedAt: 'desc' },
    }).then((bases) => bases.map((base) => {
      const sources = new Map<string, { filename: string; type?: string; uploadedAt: Date }>();
      for (const chunk of base.chunks) {
        const metadata = chunk.metadata as any;
        const filename = metadata?.filename;
        if (filename && !sources.has(filename)) {
          sources.set(filename, { filename, type: metadata?.mimeType, uploadedAt: chunk.createdAt });
        }
      }
      const { chunks, ...result } = base;
      return { ...result, sources: [...sources.values()] };
    }));
  }

  async ingestFile(tenantId: string, knowledgeBaseId: string, file: any) {
    const knowledgeBase = await this.prisma.knowledgeBase.findFirst({
      where: { id: knowledgeBaseId, tenantId },
    });
    if (!knowledgeBase) throw new NotFoundException('Knowledge base not found.');
    if (file.size > 10 * 1024 * 1024) throw new BadRequestException('Files must be 10 MB or smaller.');

    const allowed = new Set(['text/plain', 'text/markdown', 'text/csv', 'application/json', 'application/pdf']);
    if (!allowed.has(file.mimetype)) {
      throw new BadRequestException('Supported files: PDF, TXT, Markdown, CSV, and JSON.');
    }

    let content = '';
    if (file.mimetype === 'application/pdf') {
      const parser = new PDFParse({ data: file.buffer });
      try {
        content = (await parser.getText()).text;
      } finally {
        await parser.destroy();
      }
    } else {
      content = file.buffer.toString('utf-8');
    }
    if (!content.trim()) throw new BadRequestException('No readable text was found in this file.');

    await this.prisma.documentChunk.deleteMany({
      where: { knowledgeBaseId, metadata: { path: ['filename'], equals: file.originalname } },
    });
    const chunksCreated = await this.ingestText(knowledgeBaseId, content, {
      filename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    });
    return { success: true, filename: file.originalname, chunksCreated };
  }

  async deleteBase(tenantId: string, id: string) {
    const knowledgeBase = await this.prisma.knowledgeBase.findFirst({ where: { id, tenantId } });
    if (!knowledgeBase) throw new NotFoundException('Knowledge base not found.');
    await this.prisma.$transaction([
      this.prisma.documentChunk.deleteMany({ where: { knowledgeBaseId: id } }),
      this.prisma.knowledgeBase.delete({ where: { id } }),
    ]);
    return { success: true };
  }

  async ingestText(knowledgeBaseId: string, content: string, metadata: any = {}) {
    const chunks = this.chunkText(content, 1200, 180);
    const knowledgeBase = await this.prisma.knowledgeBase.findUnique({
      where: { id: knowledgeBaseId },
      select: { tenantId: true },
    });

    for (const [index, chunk] of chunks.entries()) {
      const embedding = await this.embed(chunk, knowledgeBase?.tenantId);
      await this.prisma.documentChunk.create({
        data: {
          knowledgeBaseId,
          content: chunk,
          metadata: { ...metadata, chunkIndex: index, chunkCount: chunks.length },
          embedding,
        },
      });
    }
    await this.prisma.knowledgeBase.update({ where: { id: knowledgeBaseId }, data: { updatedAt: new Date() } });
    return chunks.length;
  }

  async query(agentId: string, question: string, topK = 3) {
    const agent = await this.prisma.agent.findUnique({
      where: { id: agentId },
      select: { tenantId: true },
    });
    const questionEmbedding = await this.embed(question, agent?.tenantId);

    // 2. Fetch all chunks for this agent's knowledge bases
    // In production, use pgvector or a dedicated vector DB for efficiency
    const chunks = await this.prisma.documentChunk.findMany({
      where: {
        knowledgeBase: {
          agentId,
        },
      },
    });

    // 3. Simple Cosine Similarity Search
    const scoredChunks = chunks.map(chunk => ({
      ...chunk,
      score: this.cosineSimilarity(questionEmbedding, chunk.embedding),
    }));

    // 4. Return top K
    return scoredChunks
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  private chunkText(text: string, size: number, overlap: number): string[] {
    const clean = text.replace(/\r/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
    const chunks: string[] = [];
    let start = 0;
    while (start < clean.length) {
      let end = Math.min(start + size, clean.length);
      if (end < clean.length) {
        const paragraphBreak = clean.lastIndexOf('\n\n', end);
        const sentenceBreak = clean.lastIndexOf('. ', end);
        const naturalBreak = Math.max(paragraphBreak, sentenceBreak);
        if (naturalBreak > start + size * 0.6) end = naturalBreak + 1;
      }
      const chunk = clean.slice(start, end).trim();
      if (chunk) chunks.push(chunk);
      if (end >= clean.length) break;
      start = Math.max(start + 1, end - overlap);
    }
    return chunks;
  }

  private async embed(input: string, tenantId?: string): Promise<number[]> {
    const providerKey = tenantId ? await this.aiProviders.getActiveKey(tenantId) : null;
    const apiKey = providerKey?.provider === 'openai' ? providerKey.apiKey : this.config.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      return this.localEmbedding(input);
    }

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input,
      }),
    });

    if (!response.ok) {
      return this.localEmbedding(input);
    }

    const data = await response.json();
    return data.data?.[0]?.embedding ?? this.localEmbedding(input);
  }

  private localEmbedding(input: string): number[] {
    const vector = Array.from({ length: 64 }, () => 0);
    for (const word of input.toLowerCase().match(/[a-z0-9]+/g) ?? []) {
      let hash = 0;
      for (let index = 0; index < word.length; index++) {
        hash = (hash * 31 + word.charCodeAt(index)) >>> 0;
      }
      vector[hash % vector.length] += 1;
    }
    return vector;
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (!normA || !normB) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
