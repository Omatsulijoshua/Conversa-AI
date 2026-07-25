"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceTelephonyController = void 0;
const common_1 = require("@nestjs/common");
const conversation_service_1 = require("../conversation/conversation.service");
const prisma_service_1 = require("../prisma/prisma.service");
let VoiceTelephonyController = class VoiceTelephonyController {
    conversationService;
    prisma;
    constructor(conversationService, prisma) {
        this.conversationService = conversationService;
        this.prisma = prisma;
    }
    async inbound(agentId, tenantId) {
        let activeAgentId = agentId;
        let activeTenantId = tenantId;
        if (!activeAgentId || !activeTenantId) {
            const agent = await this.prisma.agent.findFirst({
                include: { tenant: true },
            });
            if (!agent) {
                return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Sorry, no agents are configured on this platform yet. Please check back later.</Say>
</Response>`;
            }
            activeAgentId = agent.id;
            activeTenantId = agent.tenantId;
        }
        const conversation = await this.conversationService.start(activeTenantId, activeAgentId);
        return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="/api/v1/voice/telephony/respond?agentId=${activeAgentId}&amp;tenantId=${activeTenantId}&amp;sessionId=${conversation.sessionId}" method="POST" speechTimeout="auto" speechModel="phone_call">
    <Say voice="Polly.Joanna-Neural">Hello! Thank you for calling. How can I help you today?</Say>
  </Gather>
  <Say voice="Polly.Joanna-Neural">We did not receive any input. Goodbye.</Say>
</Response>`;
    }
    async respond(speechResult, agentId, tenantId, sessionId) {
        if (!speechResult || !agentId || !tenantId || !sessionId) {
            return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna-Neural">I am sorry, I did not catch that. Goodbye.</Say>
</Response>`;
        }
        try {
            const reply = await this.conversationService.message(tenantId, sessionId, speechResult);
            return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="/api/v1/voice/telephony/respond?agentId=${agentId}&amp;tenantId=${tenantId}&amp;sessionId=${sessionId}" method="POST" speechTimeout="auto" speechModel="phone_call">
    <Say voice="Polly.Joanna-Neural">${reply.response}</Say>
  </Gather>
  <Say voice="Polly.Joanna-Neural">Thank you for calling. Goodbye.</Say>
</Response>`;
        }
        catch (error) {
            console.error('Telephony respond error:', error);
            return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna-Neural">I encountered an error processing your request. Please try again later.</Say>
</Response>`;
        }
    }
};
exports.VoiceTelephonyController = VoiceTelephonyController;
__decorate([
    (0, common_1.Post)('inbound'),
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Content-Type', 'text/xml'),
    __param(0, (0, common_1.Query)('agentId')),
    __param(1, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], VoiceTelephonyController.prototype, "inbound", null);
__decorate([
    (0, common_1.Post)('respond'),
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Content-Type', 'text/xml'),
    __param(0, (0, common_1.Body)('SpeechResult')),
    __param(1, (0, common_1.Query)('agentId')),
    __param(2, (0, common_1.Query)('tenantId')),
    __param(3, (0, common_1.Query)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], VoiceTelephonyController.prototype, "respond", null);
exports.VoiceTelephonyController = VoiceTelephonyController = __decorate([
    (0, common_1.Controller)('voice/telephony'),
    __metadata("design:paramtypes", [conversation_service_1.ConversationService,
        prisma_service_1.PrismaService])
], VoiceTelephonyController);
//# sourceMappingURL=voice-telephony.controller.js.map