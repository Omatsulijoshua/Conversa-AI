import { ConversationService } from '../conversation/conversation.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class VoiceTelephonyController {
    private readonly conversationService;
    private readonly prisma;
    constructor(conversationService: ConversationService, prisma: PrismaService);
    inbound(paramTenantId?: string, paramAgentId?: string, queryAgentId?: string, queryTenantId?: string): Promise<string>;
    respond(speechResult?: string, paramTenantId?: string, paramAgentId?: string, queryAgentId?: string, queryTenantId?: string, sessionId?: string): Promise<string>;
}
