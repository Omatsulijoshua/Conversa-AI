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
exports.KnowledgeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const ai_provider_service_1 = require("../ai-provider/ai-provider.service");
let KnowledgeService = class KnowledgeService {
    prisma;
    config;
    aiProviders;
    constructor(prisma, config, aiProviders) {
        this.prisma = prisma;
        this.config = config;
        this.aiProviders = aiProviders;
    }
    async ingestText(knowledgeBaseId, content, metadata = {}) {
        const chunks = this.chunkText(content, 1000);
        const knowledgeBase = await this.prisma.knowledgeBase.findUnique({
            where: { id: knowledgeBaseId },
            select: { tenantId: true },
        });
        for (const chunk of chunks) {
            const embedding = await this.embed(chunk, knowledgeBase?.tenantId);
            await this.prisma.documentChunk.create({
                data: {
                    knowledgeBaseId,
                    content: chunk,
                    metadata,
                    embedding,
                },
            });
        }
    }
    async query(agentId, question, topK = 3) {
        const agent = await this.prisma.agent.findUnique({
            where: { id: agentId },
            select: { tenantId: true },
        });
        const questionEmbedding = await this.embed(question, agent?.tenantId);
        const chunks = await this.prisma.documentChunk.findMany({
            where: {
                knowledgeBase: {
                    agentId,
                },
            },
        });
        const scoredChunks = chunks.map(chunk => ({
            ...chunk,
            score: this.cosineSimilarity(questionEmbedding, chunk.embedding),
        }));
        return scoredChunks
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);
    }
    chunkText(text, size) {
        const chunks = [];
        for (let i = 0; i < text.length; i += size) {
            chunks.push(text.slice(i, i + size));
        }
        return chunks;
    }
    async embed(input, tenantId) {
        const providerKey = tenantId ? await this.aiProviders.getActiveKey(tenantId) : null;
        const apiKey = providerKey?.provider === 'openai' ? providerKey.apiKey : this.config.get('OPENAI_API_KEY');
        if (!apiKey) {
            return this.localEmbedding(input);
        }
        const response = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'text-embedding-3-small',
                input,
            }),
        });
        if (!response.ok) {
            return this.localEmbedding(input);
        }
        const data = await response.json();
        return data.data?.[0]?.embedding ?? this.localEmbedding(input);
    }
    localEmbedding(input) {
        const vector = Array.from({ length: 64 }, () => 0);
        for (const word of input.toLowerCase().match(/[a-z0-9]+/g) ?? []) {
            let hash = 0;
            for (let index = 0; index < word.length; index++) {
                hash = (hash * 31 + word.charCodeAt(index)) >>> 0;
            }
            vector[hash % vector.length] += 1;
        }
        return vector;
    }
    cosineSimilarity(vecA, vecB) {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        if (!normA || !normB)
            return 0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
};
exports.KnowledgeService = KnowledgeService;
exports.KnowledgeService = KnowledgeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        ai_provider_service_1.AiProviderService])
], KnowledgeService);
//# sourceMappingURL=knowledge.service.js.map