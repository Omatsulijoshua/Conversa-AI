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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const uuid_1 = require("uuid");
const ai_service_1 = require("../ai/ai.service");
const knowledge_service_1 = require("../knowledge/knowledge.service");
let ConversationService = class ConversationService {
    prisma;
    ai;
    knowledge;
    constructor(prisma, ai, knowledge) {
        this.prisma = prisma;
        this.ai = ai;
        this.knowledge = knowledge;
    }
    async start(tenantId, agentId, customSessionId) {
        const agent = await this.prisma.agent.findFirst({
            where: { id: agentId, tenantId },
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        const sessionId = customSessionId || (0, uuid_1.v4)();
        return this.prisma.conversation.create({
            data: {
                sessionId,
                agentId,
                tenantId,
                messages: [],
            },
        });
    }
    async message(tenantId, sessionId, message) {
        const conversation = await this.prisma.conversation.findFirst({
            where: { sessionId, tenantId },
            include: { agent: true },
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        const messages = conversation.messages || [];
        messages.push({ role: 'user', content: message, timestamp: new Date() });
        const recent = messages
            .slice(-20)
            .filter(m => m?.role === 'user' || m?.role === 'assistant')
            .map(m => ({ role: m.role, content: String(m.content ?? '') }));
        const topChunks = await this.knowledge.query(conversation.agentId, message, 3);
        const knowledgeContext = topChunks.map((c) => `- ${c.content}`).join('\n');
        const agentSettings = conversation.agent.settings || {};
        const modelName = agentSettings.modelName || agentSettings.model || null;
        const temperature = agentSettings.temperature !== undefined && agentSettings.temperature !== null ? Number(agentSettings.temperature) : null;
        const aiResponse = await this.ai.reply({
            tenantId,
            agent: {
                name: conversation.agent.name,
                tone: conversation.agent.tone,
                industry: conversation.agent.industry,
                instructions: conversation.agent.instructions,
            },
            messages: recent,
            knowledgeContext: knowledgeContext.length ? knowledgeContext : null,
            modelName,
            temperature,
        });
        messages.push({ role: 'assistant', content: aiResponse, timestamp: new Date() });
        await this.prisma.conversation.update({
            where: { id: conversation.id },
            data: { messages },
        });
        await this.prisma.usage.create({
            data: {
                tenantId,
                metric: 'messages',
                quantity: 1,
            },
        });
        return { response: aiResponse };
    }
    async history(tenantId, sessionId) {
        return this.prisma.conversation.findFirst({
            where: { sessionId, tenantId },
        });
    }
};
exports.ConversationService = ConversationService;
exports.ConversationService = ConversationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AiService,
        knowledge_service_1.KnowledgeService])
], ConversationService);
//# sourceMappingURL=conversation.service.js.map