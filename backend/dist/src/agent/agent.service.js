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
exports.AgentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AgentService = class AgentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, data) {
        const tone = data.tone || 'Warm, patient, clear, and natural.';
        return this.prisma.agent.create({
            data: {
                name: data.name,
                tone,
                industry: data.industry || data.type,
                instructions: data.instructions || this.defaultBusinessRules(data.type || data.industry || 'Support', tone),
                voiceId: data.voiceId || data.voice,
                tenantId,
            },
        });
    }
    async findAll(tenantId) {
        return this.prisma.agent.findMany({
            where: { tenantId },
        });
    }
    async findOne(tenantId, id) {
        return this.prisma.agent.findFirst({
            where: { id, tenantId },
        });
    }
    async update(tenantId, id, data) {
        return this.prisma.agent.updateMany({
            where: { id, tenantId },
            data: {
                ...(data.name !== undefined ? { name: data.name } : {}),
                ...(data.tone !== undefined ? { tone: data.tone } : {}),
                ...(data.industry !== undefined || data.type !== undefined ? { industry: data.industry || data.type } : {}),
                ...(data.instructions !== undefined ? { instructions: data.instructions } : {}),
                ...(data.voiceId !== undefined || data.voice !== undefined ? { voiceId: data.voiceId || data.voice } : {}),
            },
        });
    }
    async remove(tenantId, id) {
        return this.prisma.agent.deleteMany({
            where: { id, tenantId },
        });
    }
    defaultBusinessRules(goal, tone) {
        return [
            'Business Rules for Customer Calls',
            'Greeting: Hi, thanks for calling. How can I help you today?',
            `Tone: ${tone}`,
            `Main Goal: Help with ${goal} questions, explain next steps, and escalate when needed.`,
            'Business Hours: Monday to Friday, 9 AM to 5 PM.',
            'Refund Policy: Ask for the order number, email, and reason. Eligible refunds are reviewed within 2 business days.',
            'Escalation Rules: Escalate angry customers, billing disputes, fraud reports, legal questions, and account ownership changes.',
            'Information to Collect: Name, phone number, email, order number, and a short description of the issue.',
            'Never Say or Ask: Do not ask for passwords, full card numbers, SSNs, or legal/medical advice.',
            'Call Closing: Summarize the next step and ask if there is anything else you can help with.',
        ].join('\n\n');
    }
};
exports.AgentService = AgentService;
exports.AgentService = AgentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AgentService);
//# sourceMappingURL=agent.service.js.map