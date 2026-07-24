import { ConfigService } from '@nestjs/config';
import { GlobalAiKeyService } from './global-ai-key.service';
export declare class GlobalAiKeyController {
    private readonly service;
    private readonly config;
    constructor(service: GlobalAiKeyService, config: ConfigService);
    private verifyToken;
    list(adminToken?: string): Promise<{
        strategy: string;
        keys: {
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
        }[];
    }>;
    create(body: {
        provider: string;
        apiKey: string;
        label: string;
        modelName?: string;
        baseUrl?: string;
        weight?: number;
        isActive?: boolean;
    }, adminToken?: string): Promise<{
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
    }>;
    remove(id: string, adminToken?: string): Promise<{
        deleted: boolean;
    }>;
    toggleActive(id: string, adminToken?: string): Promise<{
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
    }>;
    updateStrategy(body: {
        strategy: string;
    }, adminToken?: string): Promise<{
        id: string;
        updatedAt: Date;
        strategy: string;
    }>;
}
