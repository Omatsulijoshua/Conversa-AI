import { ConversationService } from './conversation.service';
export declare class ConversationController {
    private readonly conversationService;
    constructor(conversationService: ConversationService);
    start(tenant: any, body: {
        agentId: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        agentId: string;
        sessionId: string;
        messages: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    message(tenant: any, body: {
        sessionId: string;
        message: string;
    }): Promise<{
        response: string;
    }>;
    history(tenant: any, sessionId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        agentId: string;
        sessionId: string;
        messages: import("@prisma/client/runtime/client").JsonValue | null;
    } | null>;
}
