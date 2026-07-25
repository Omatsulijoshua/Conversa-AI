import { ConversationService } from '../conversation/conversation.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class TwilioMessagingController {
    private readonly conversationService;
    private readonly prisma;
    constructor(conversationService: ConversationService, prisma: PrismaService);
    handleIncomingMessage(body?: string, from?: string, paramTenantId?: string, paramAgentId?: string, queryAgentId?: string, queryTenantId?: string): Promise<string>;
}
