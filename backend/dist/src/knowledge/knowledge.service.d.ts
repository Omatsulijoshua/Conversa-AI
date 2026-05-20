import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AiProviderService } from '../ai-provider/ai-provider.service';
export declare class KnowledgeService {
    private prisma;
    private config;
    private aiProviders;
    constructor(prisma: PrismaService, config: ConfigService, aiProviders: AiProviderService);
    ingestText(knowledgeBaseId: string, content: string, metadata?: any): Promise<void>;
    query(agentId: string, question: string, topK?: number): Promise<{
        score: number;
        id: string;
        createdAt: Date;
        content: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        embedding: number[];
        knowledgeBaseId: string;
    }[]>;
    private chunkText;
    private embed;
    private localEmbedding;
    private cosineSimilarity;
}
