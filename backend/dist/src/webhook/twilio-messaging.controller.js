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
exports.TwilioMessagingController = void 0;
const common_1 = require("@nestjs/common");
const conversation_service_1 = require("../conversation/conversation.service");
const prisma_service_1 = require("../prisma/prisma.service");
let TwilioMessagingController = class TwilioMessagingController {
    conversationService;
    prisma;
    constructor(conversationService, prisma) {
        this.conversationService = conversationService;
        this.prisma = prisma;
    }
    async handleIncomingMessage(body, from, paramTenantId, paramAgentId, queryAgentId, queryTenantId) {
        if (!body || !from) {
            return `<?xml version="1.0" encoding="UTF-8"?>
<Response />`;
        }
        let activeAgentId = paramAgentId || queryAgentId;
        let activeTenantId = paramTenantId || queryTenantId;
        if (!activeAgentId || !activeTenantId) {
            const agent = await this.prisma.agent.findFirst({
                include: { tenant: true },
            });
            if (!agent) {
                return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Platform error: No AI agents are active.</Message>
</Response>`;
            }
            activeAgentId = agent.id;
            activeTenantId = agent.tenantId;
        }
        try {
            const existing = await this.prisma.conversation.findFirst({
                where: { sessionId: from, tenantId: activeTenantId },
            });
            if (!existing) {
                await this.conversationService.start(activeTenantId, activeAgentId, from);
            }
            const reply = await this.conversationService.message(activeTenantId, from, body);
            return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${reply.response}</Message>
</Response>`;
        }
        catch (error) {
            console.error('Twilio messaging error:', error);
            return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Sorry, I encountered an issue processing your request. Please try again later.</Message>
</Response>`;
        }
    }
};
exports.TwilioMessagingController = TwilioMessagingController;
__decorate([
    (0, common_1.Post)('messaging'),
    (0, common_1.Post)('messaging/:tenantId/:agentId'),
    (0, common_1.HttpCode)(200),
    (0, common_1.Header)('Content-Type', 'text/xml'),
    __param(0, (0, common_1.Body)('Body')),
    __param(1, (0, common_1.Body)('From')),
    __param(2, (0, common_1.Param)('tenantId')),
    __param(3, (0, common_1.Param)('agentId')),
    __param(4, (0, common_1.Query)('agentId')),
    __param(5, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TwilioMessagingController.prototype, "handleIncomingMessage", null);
exports.TwilioMessagingController = TwilioMessagingController = __decorate([
    (0, common_1.Controller)('webhooks/twilio'),
    __metadata("design:paramtypes", [conversation_service_1.ConversationService,
        prisma_service_1.PrismaService])
], TwilioMessagingController);
//# sourceMappingURL=twilio-messaging.controller.js.map