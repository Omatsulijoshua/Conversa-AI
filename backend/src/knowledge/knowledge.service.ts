import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AiProviderService } from '../ai-provider/ai-provider.service';

@Injectable()
export class KnowledgeService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private aiProviders: AiProviderService,
  ) {}

  async ingestText(knowledgeBaseId: string, content: string, metadata: any = {}) {
    // 1. Chunk the text (simple chunking for now)
    const chunks = this.chunkText(content, 1000);
    const knowledgeBase = await this.prisma.knowledgeBase.findUnique({
      where: { id: knowledgeBaseId },
      select: { tenantId: true },
    });

    for (const chunk of chunks) {
      const embedding = await this.embed(chunk, knowledgeBase?.tenantId);

      // 3. Save to DB
      await this.prisma.documentChunk.create({
        data: {
          knowledgeBaseId,
          content: chunk,
          metadata,
          embedding,
        },
      });
    }
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

  private chunkText(text: string, size: number): string[] {
    const chunks = [];
    for (let i = 0; i < text.length; i += size) {
      chunks.push(text.slice(i, i + size));
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
