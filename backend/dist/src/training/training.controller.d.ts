import { PrismaService } from '../prisma/prisma.service';
import type { Response } from 'express';
import { KnowledgeService } from '../knowledge/knowledge.service';
export declare class TrainingController {
    private prisma;
    private knowledge;
    constructor(prisma: PrismaService, knowledge: KnowledgeService);
    bootstrap(tenant: any, body?: {
        businessName?: string;
    }): Promise<{
        agent: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            tone: string | null;
            industry: string | null;
            instructions: string | null;
            voiceId: string | null;
            settings: import("@prisma/client/runtime/client").JsonValue | null;
        };
        knowledgeBase: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            description: string | null;
            agentId: string;
        };
        ready: boolean;
        testPrompt: string;
    }>;
    exportConversations(tenant: any, res: Response): Promise<void>;
    exportCalls(tenant: any, res: Response, includeTranscript?: string): Promise<void>;
}
