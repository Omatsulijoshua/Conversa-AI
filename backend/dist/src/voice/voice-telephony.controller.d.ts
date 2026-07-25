import { ConversationService } from '../conversation/conversation.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class VoiceTelephonyController {
    private readonly conversationService;
    private readonly prisma;
    constructor(conversationService: ConversationService, prisma: PrismaService);
    inbound(agentId?: string, tenantId?: string): Promise<string>;
    respond(speechResult?: string, agentId?: string, tenantId?: string, sessionId?: string): Promise<string>;
}
