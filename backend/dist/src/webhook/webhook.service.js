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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const axios_1 = __importDefault(require("axios"));
let WebhookService = class WebhookService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async dispatch(tenantId, event, payload) {
        const webhooks = await this.prisma.webhook.findMany({
            where: {
                tenantId,
                events: { has: event },
            },
        });
        const promises = webhooks.map(async (webhook) => {
            try {
                await axios_1.default.post(webhook.url, {
                    event,
                    payload,
                    timestamp: new Date().toISOString(),
                }, {
                    headers: {
                        'X-Conversa-Signature': 'mock_signature',
                    },
                });
            }
            catch (err) {
                console.error(`Failed to dispatch webhook to ${webhook.url}:`, err.message);
            }
        });
        await Promise.all(promises);
    }
    async register(tenantId, url, events) {
        return this.prisma.webhook.create({
            data: {
                tenantId,
                url,
                events,
            },
        });
    }
    async findByTenant(tenantId) {
        return this.prisma.webhook.findMany({
            where: { tenantId },
        });
    }
    async remove(tenantId, id) {
        return this.prisma.webhook.deleteMany({
            where: { id, tenantId },
        });
    }
};
exports.WebhookService = WebhookService;
exports.WebhookService = WebhookService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WebhookService);
//# sourceMappingURL=webhook.service.js.map