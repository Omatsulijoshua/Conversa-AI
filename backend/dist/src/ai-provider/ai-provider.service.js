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
exports.AiProviderService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_provider_constants_1 = require("./ai-provider.constants");
let AiProviderService = class AiProviderService {
    prisma;
    config;
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
    }
    async list(tenantId) {
        const rows = await this.prisma.aiProviderKey.findMany({
            where: { tenantId },
            orderBy: [{ isActive: 'desc' }, { createdAt: 'asc' }],
        });
        return {
            limit: 7,
            supportedProviders: ai_provider_constants_1.SUPPORTED_AI_PROVIDERS,
            providers: rows.map(row => this.publicProvider(row)),
        };
    }
    async createOrUpdate(tenantId, input) {
        const provider = this.normalizeProvider(input.provider);
        if (!input.apiKey?.trim()) {
            throw new common_1.BadRequestException('API key is required');
        }
        const existingCount = await this.prisma.aiProviderKey.count({ where: { tenantId } });
        const existing = await this.prisma.aiProviderKey.findUnique({
            where: { tenantId_provider: { tenantId, provider } },
        });
        if (!existing && existingCount >= 7) {
            throw new common_1.BadRequestException('You can store up to 7 AI provider keys');
        }
        if (input.makeActive ?? existingCount === 0) {
            await this.prisma.aiProviderKey.updateMany({
                where: { tenantId },
                data: { isActive: false },
            });
        }
        const row = await this.prisma.aiProviderKey.upsert({
            where: { tenantId_provider: { tenantId, provider } },
            update: {
                label: input.label?.trim() || this.defaultLabel(provider),
                encryptedApiKey: this.encrypt(input.apiKey.trim()),
                keyPreview: this.preview(input.apiKey.trim()),
                modelName: input.modelName?.trim() || ai_provider_constants_1.DEFAULT_CHAT_MODELS[provider],
                baseUrl: input.baseUrl?.trim() || ai_provider_constants_1.OPENAI_COMPATIBLE_BASE_URLS[provider] || null,
                isActive: input.makeActive ?? existingCount === 0,
            },
            create: {
                provider,
                label: input.label?.trim() || this.defaultLabel(provider),
                encryptedApiKey: this.encrypt(input.apiKey.trim()),
                keyPreview: this.preview(input.apiKey.trim()),
                modelName: input.modelName?.trim() || ai_provider_constants_1.DEFAULT_CHAT_MODELS[provider],
                baseUrl: input.baseUrl?.trim() || ai_provider_constants_1.OPENAI_COMPATIBLE_BASE_URLS[provider] || null,
                isActive: input.makeActive ?? existingCount === 0,
                tenantId,
            },
        });
        return this.publicProvider(row);
    }
    async setActive(tenantId, id) {
        const provider = await this.prisma.aiProviderKey.findFirst({ where: { id, tenantId } });
        if (!provider)
            throw new common_1.NotFoundException('AI provider key not found');
        await this.prisma.aiProviderKey.updateMany({ where: { tenantId }, data: { isActive: false } });
        const row = await this.prisma.aiProviderKey.update({ where: { id }, data: { isActive: true } });
        return this.publicProvider(row);
    }
    async remove(tenantId, id) {
        const provider = await this.prisma.aiProviderKey.findFirst({ where: { id, tenantId } });
        if (!provider)
            throw new common_1.NotFoundException('AI provider key not found');
        await this.prisma.aiProviderKey.delete({ where: { id } });
        if (provider.isActive) {
            const next = await this.prisma.aiProviderKey.findFirst({
                where: { tenantId },
                orderBy: { createdAt: 'asc' },
            });
            if (next) {
                await this.prisma.aiProviderKey.update({ where: { id: next.id }, data: { isActive: true } });
            }
        }
        return { deleted: true };
    }
    async getActiveKey(tenantId) {
        const row = await this.prisma.aiProviderKey.findFirst({
            where: { tenantId, isActive: true },
        });
        if (row) {
            return {
                ...this.publicProvider(row),
                apiKey: this.decrypt(row.encryptedApiKey),
            };
        }
        const envKey = this.config.get('OPENAI_API_KEY');
        if (!envKey)
            return null;
        return {
            id: 'env-openai',
            provider: 'openai',
            label: 'OpenAI Environment Key',
            keyPreview: this.preview(envKey),
            modelName: this.config.get('OPENAI_CHAT_MODEL') || ai_provider_constants_1.DEFAULT_CHAT_MODELS.openai,
            baseUrl: ai_provider_constants_1.OPENAI_COMPATIBLE_BASE_URLS.openai || null,
            isActive: true,
            lastUsed: null,
            createdAt: null,
            updatedAt: null,
            apiKey: envKey,
        };
    }
    async markUsed(id) {
        if (id === 'env-openai')
            return;
        await this.prisma.aiProviderKey.update({
            where: { id },
            data: { lastUsed: new Date() },
        });
    }
    publicProvider(row) {
        return {
            id: row.id,
            provider: row.provider,
            label: row.label,
            keyPreview: row.keyPreview,
            modelName: row.modelName,
            baseUrl: row.baseUrl,
            isActive: row.isActive,
            lastUsed: row.lastUsed,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        };
    }
    normalizeProvider(provider) {
        const normalized = provider?.toLowerCase().trim();
        if (!ai_provider_constants_1.SUPPORTED_AI_PROVIDERS.includes(normalized)) {
            throw new common_1.BadRequestException(`Supported providers: ${ai_provider_constants_1.SUPPORTED_AI_PROVIDERS.join(', ')}`);
        }
        return normalized;
    }
    defaultLabel(provider) {
        return `${provider[0].toUpperCase()}${provider.slice(1)} Key`;
    }
    preview(apiKey) {
        if (apiKey.length <= 8)
            return '••••••••';
        return `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`;
    }
    encrypt(value) {
        const iv = (0, crypto_1.randomBytes)(12);
        const cipher = (0, crypto_1.createCipheriv)('aes-256-gcm', this.secret(), iv);
        const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
        const tag = cipher.getAuthTag();
        return `${iv.toString('base64')}.${tag.toString('base64')}.${encrypted.toString('base64')}`;
    }
    decrypt(value) {
        const [ivRaw, tagRaw, encryptedRaw] = value.split('.');
        const decipher = (0, crypto_1.createDecipheriv)('aes-256-gcm', this.secret(), Buffer.from(ivRaw, 'base64'));
        decipher.setAuthTag(Buffer.from(tagRaw, 'base64'));
        return Buffer.concat([
            decipher.update(Buffer.from(encryptedRaw, 'base64')),
            decipher.final(),
        ]).toString('utf8');
    }
    secret() {
        return (0, crypto_1.createHash)('sha256')
            .update(this.config.get('AI_KEY_ENCRYPTION_SECRET') || this.config.get('JWT_SECRET') || 'dev_secret_change_me')
            .digest();
    }
};
exports.AiProviderService = AiProviderService;
exports.AiProviderService = AiProviderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], AiProviderService);
//# sourceMappingURL=ai-provider.service.js.map