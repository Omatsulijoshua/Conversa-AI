import type { Request } from 'express';
import { AiProviderService } from './ai-provider.service';
export declare class AiProviderController {
    private readonly aiProviderService;
    constructor(aiProviderService: AiProviderService);
    list(req: Request): Promise<{
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
    createOrUpdate(req: Request, body: any): Promise<{
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
    setActive(req: Request, id: string): Promise<{
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
    remove(req: Request, id: string): Promise<{
        deleted: boolean;
    }>;
}
