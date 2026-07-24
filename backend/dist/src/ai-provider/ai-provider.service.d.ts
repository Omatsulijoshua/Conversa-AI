import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { GlobalAiKeyService } from '../admin/global-ai-key.service';
type CreateProviderKeyInput = {
    provider: string;
    apiKey: string;
    label?: string;
    modelName?: string;
    baseUrl?: string;
    makeActive?: boolean;
};
export declare class AiProviderService {
    private prisma;
    private config;
    private globalKeys;
    constructor(prisma: PrismaService, config: ConfigService, globalKeys: GlobalAiKeyService);
    list(tenantId: string): Promise<{
        limit: number;
        supportedProviders: readonly ["openai", "gemini", "grok", "anthropic", "deepseek", "mistral", "openrouter", "groq"];
        providers: {
            id: string;
            provider: string;
            label: string;
            keyPreview: string;
            modelName: string | null;
            baseUrl: string | null;
            isActive: boolean;
            lastUsed: Date | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    createOrUpdate(tenantId: string, input: CreateProviderKeyInput): Promise<{
        id: string;
        provider: string;
        label: string;
        keyPreview: string;
        modelName: string | null;
        baseUrl: string | null;
        isActive: boolean;
        lastUsed: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    setActive(tenantId: string, id: string): Promise<{
        id: string;
        provider: string;
        label: string;
        keyPreview: string;
        modelName: string | null;
        baseUrl: string | null;
        isActive: boolean;
        lastUsed: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(tenantId: string, id: string): Promise<{
        deleted: boolean;
    }>;
    getActiveKey(tenantId: string): Promise<{
        apiKey: string;
        id: any;
        provider: any;
        label: any;
        keyPreview: any;
        modelName: any;
        baseUrl: any;
        weight: any;
        isActive: any;
        lastUsed: any;
        createdAt: any;
        updatedAt: any;
    } | {
        apiKey: string;
        id: string;
        provider: string;
        label: string;
        keyPreview: string;
        modelName: string | null;
        baseUrl: string | null;
        isActive: boolean;
        lastUsed: Date | null;
        createdAt: Date;
        updatedAt: Date;
    } | {
        id: string;
        provider: string;
        label: string;
        keyPreview: string;
        modelName: string;
        baseUrl: string | null;
        isActive: boolean;
        lastUsed: null;
        createdAt: null;
        updatedAt: null;
        apiKey: string;
    } | null>;
    markUsed(id: string): Promise<void>;
    private publicProvider;
    private normalizeProvider;
    private defaultLabel;
    private preview;
    private encrypt;
    private decrypt;
    private secret;
}
export {};
