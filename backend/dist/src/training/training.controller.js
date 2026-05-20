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
exports.TrainingController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const tenant_auth_guard_1 = require("../auth/tenant-auth.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
const prisma_service_1 = require("../prisma/prisma.service");
const knowledge_service_1 = require("../knowledge/knowledge.service");
let TrainingController = class TrainingController {
    prisma;
    knowledge;
    constructor(prisma, knowledge) {
        this.prisma = prisma;
        this.knowledge = knowledge;
    }
    async bootstrap(tenant, body) {
        const businessName = body?.businessName?.trim() || 'Conversa Demo';
        const agent = await this.prisma.agent.upsert({
            where: {
                id: `${tenant.id}_demo_support`,
            },
            update: {
                name: `${businessName} Support`,
                tone: 'warm, calm, natural, and concise',
                industry: 'customer support',
                instructions: 'Answer like a capable human customer support representative. Confirm the customer need, give one clear next step, and escalate billing, account access, or safety issues when needed.',
            },
            create: {
                id: `${tenant.id}_demo_support`,
                name: `${businessName} Support`,
                tone: 'warm, calm, natural, and concise',
                industry: 'customer support',
                instructions: 'Answer like a capable human customer support representative. Confirm the customer need, give one clear next step, and escalate billing, account access, or safety issues when needed.',
                voiceId: 'alloy',
                tenantId: tenant.id,
            },
        });
        const knowledgeBase = await this.prisma.knowledgeBase.upsert({
            where: { id: `${agent.id}_training_pack` },
            update: { name: 'Customer Support Training Pack' },
            create: {
                id: `${agent.id}_training_pack`,
                name: 'Customer Support Training Pack',
                description: 'Starter support policies and call handling examples.',
                agentId: agent.id,
                tenantId: tenant.id,
            },
        });
        const existingChunks = await this.prisma.documentChunk.count({ where: { knowledgeBaseId: knowledgeBase.id } });
        if (existingChunks === 0) {
            await this.knowledge.ingestText(knowledgeBase.id, [
                'Greeting: Start every call with a short warm greeting, then ask how you can help.',
                'Refunds: If a customer asks for a refund, confirm their email, order number, and reason. Explain that eligible refunds are reviewed within 2 business days.',
                'Account access: For login trouble, ask the customer to confirm their email, then guide them to reset their password. Never ask for a full password.',
                'Escalation: Escalate to a human when the customer is angry, reports fraud, asks for legal advice, or needs account ownership changes.',
                'Closing: End by summarizing the next step and asking if there is anything else you can help with.',
            ].join('\n\n'), { source: 'bootstrap-training-pack' });
        }
        return {
            agent,
            knowledgeBase,
            ready: true,
            testPrompt: 'Hi, I need help with a refund for my order.',
        };
    }
    async exportConversations(tenant, res) {
        const conversations = await this.prisma.conversation.findMany({
            where: { tenantId: tenant.id },
            include: { agent: true },
            orderBy: { createdAt: 'desc' },
            take: 1000,
        });
        const lines = conversations.map(c => JSON.stringify({
            type: 'conversation',
            id: c.id,
            sessionId: c.sessionId,
            agent: { id: c.agentId, name: c.agent.name },
            createdAt: c.createdAt,
            messages: c.messages ?? [],
        }));
        res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
        res.send(lines.join('\n'));
    }
    async exportCalls(tenant, res, includeTranscript) {
        const calls = await this.prisma.call.findMany({
            where: { tenantId: tenant.id },
            include: { agent: true },
            orderBy: { createdAt: 'desc' },
            take: 1000,
        });
        const withTranscript = includeTranscript === '1' || includeTranscript === 'true';
        const lines = calls.map(c => JSON.stringify({
            type: 'call',
            id: c.id,
            sid: c.sid,
            from: c.from,
            to: c.to,
            status: c.status,
            duration: c.duration,
            agent: { id: c.agentId, name: c.agent.name },
            createdAt: c.createdAt,
            transcript: withTranscript ? c.transcript ?? null : undefined,
            summary: c.summary ?? null,
            outcome: c.outcome ?? null,
        }));
        res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
        res.send(lines.join('\n'));
    }
};
exports.TrainingController = TrainingController;
__decorate([
    (0, common_2.Post)('bootstrap'),
    __param(0, (0, tenant_decorator_1.Tenant)()),
    __param(1, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "bootstrap", null);
__decorate([
    (0, common_1.Get)('export/conversations'),
    __param(0, (0, tenant_decorator_1.Tenant)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "exportConversations", null);
__decorate([
    (0, common_1.Get)('export/calls'),
    __param(0, (0, tenant_decorator_1.Tenant)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)('includeTranscript')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "exportCalls", null);
exports.TrainingController = TrainingController = __decorate([
    (0, common_1.Controller)('training'),
    (0, common_1.UseGuards)(tenant_auth_guard_1.TenantAuthGuard),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        knowledge_service_1.KnowledgeService])
], TrainingController);
//# sourceMappingURL=training.controller.js.map