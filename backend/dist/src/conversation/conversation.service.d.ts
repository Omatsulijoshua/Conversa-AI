import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { KnowledgeService } from '../knowledge/knowledge.service';
export declare class ConversationService {
    private prisma;
    private ai;
    private knowledge;
    constructor(prisma: PrismaService, ai: AiService, knowledge: KnowledgeService);
    start(tenantId: string, agentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        agentId: string;
        sessionId: string;
        messages: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    message(tenantId: string, sessionId: string, message: string): Promise<{
        response: string;
    }>;
    history(tenantId: string, sessionId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        agentId: string;
        sessionId: string;
        messages: import("@prisma/client/runtime/client").JsonValue | null;
    } | null>;
}
