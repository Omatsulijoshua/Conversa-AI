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
exports.GlobalAiKeyService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
let GlobalAiKeyService = class GlobalAiKeyService {
    prisma;
    config;
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
    }
    async list() {
        const [keys, config] = await Promise.all([
            this.prisma.globalAiKey.findMany({
                orderBy: { createdAt: 'desc' },
            }),
            this.getOrCreateRoutingConfig(),
        ]);
        return {
            strategy: config.strategy,
            keys: keys.map(k => this.publicFormat(k)),
        };
    }
    async create(input) {
        if (!input.apiKey?.trim()) {
            throw new common_1.BadRequestException('API key is required');
        }
        const rawKeys = input.apiKey.split(',').map(k => k.trim()).filter(Boolean);
        if (rawKeys.length === 0) {
            throw new common_1.BadRequestException('API key is required');
        }
        let firstKeyRecord = null;
        for (let i = 0; i < rawKeys.length; i++) {
            const keyStr = rawKeys[i];
            const countLabel = rawKeys.length > 1 ? ` #${i + 1}` : '';
            const keyRecord = await this.prisma.globalAiKey.create({
                data: {
                    provider: input.provider.toLowerCase().trim(),
                    label: `${input.label.trim()}${countLabel}`,
                    encryptedApiKey: this.encrypt(keyStr),
                    keyPreview: this.preview(keyStr),
                    modelName: input.modelName?.trim() || null,
                    baseUrl: input.baseUrl?.trim() || null,
                    weight: input.weight ?? 1,
                    isActive: input.isActive ?? true,
                },
            });
            if (i === 0) {
                firstKeyRecord = keyRecord;
            }
        }
        return this.publicFormat(firstKeyRecord);
    }
    async remove(id) {
        const existing = await this.prisma.globalAiKey.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Global key not found');
        await this.prisma.globalAiKey.delete({ where: { id } });
        return { deleted: true };
    }
    async toggleActive(id) {
        const existing = await this.prisma.globalAiKey.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Global key not found');
        const updated = await this.prisma.globalAiKey.update({
            where: { id },
            data: { isActive: !existing.isActive },
        });
        return this.publicFormat(updated);
    }
    async updateStrategy(strategy) {
        const normalized = strategy.toLowerCase().trim();
        if (!['weighted', 'round-robin', 'failover'].includes(normalized)) {
            throw new common_1.BadRequestException('Invalid routing strategy. Choose weighted, round-robin, or failover.');
        }
        const config = await this.prisma.globalRoutingConfig.upsert({
            where: { id: 'global_routing_config' },
            update: { strategy: normalized },
            create: { id: 'global_routing_config', strategy: normalized },
        });
        return config;
    }
    async selectRoutedKey(provider) {
        const activeKeys = await this.prisma.globalAiKey.findMany({
            where: {
                isActive: true,
                ...(provider ? { provider: provider.toLowerCase().trim() } : {}),
            },
        });
        if (activeKeys.length === 0) {
            return null;
        }
        const config = await this.getOrCreateRoutingConfig();
        let selected = null;
        if (config.strategy === 'round-robin') {
            const sorted = [...activeKeys].sort((a, b) => {
                if (!a.lastUsed)
                    return -1;
                if (!b.lastUsed)
                    return 1;
                return a.lastUsed.getTime() - b.lastUsed.getTime();
            });
            selected = sorted[0];
        }
        else if (config.strategy === 'failover') {
            const sorted = [...activeKeys].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
            selected = sorted[0];
        }
        else {
            const totalWeight = activeKeys.reduce((sum, k) => sum + (k.weight || 1), 0);
            const randomValue = Math.random() * totalWeight;
            let runningSum = 0;
            for (const key of activeKeys) {
                runningSum += key.weight || 1;
                if (randomValue <= runningSum) {
                    selected = key;
                    break;
                }
            }
            if (!selected)
                selected = activeKeys[0];
        }
        if (selected) {
            await this.prisma.globalAiKey.update({
                where: { id: selected.id },
                data: { lastUsed: new Date() },
            });
            return {
                ...this.publicFormat(selected),
                apiKey: this.decrypt(selected.encryptedApiKey),
            };
        }
        return null;
    }
    async getOrCreateRoutingConfig() {
        let config = await this.prisma.globalRoutingConfig.findUnique({
            where: { id: 'global_routing_config' },
        });
        if (!config) {
            config = await this.prisma.globalRoutingConfig.create({
                data: { id: 'global_routing_config', strategy: 'weighted' },
            });
        }
        return config;
    }
    publicFormat(row) {
        return {
            id: row.id,
            provider: row.provider,
            label: row.label,
            keyPreview: row.keyPreview,
            modelName: row.modelName,
            baseUrl: row.baseUrl,
            weight: row.weight,
            isActive: row.isActive,
            lastUsed: row.lastUsed,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        };
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
exports.GlobalAiKeyService = GlobalAiKeyService;
exports.GlobalAiKeyService = GlobalAiKeyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], GlobalAiKeyService);
//# sourceMappingURL=global-ai-key.service.js.map