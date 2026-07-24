import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
type CreateGlobalKeyInput = {
    provider: string;
    apiKey: string;
    label: string;
    modelName?: string;
    baseUrl?: string;
    weight?: number;
    isActive?: boolean;
};
export declare class GlobalAiKeyService {
    private prisma;
    private config;
    constructor(prisma: PrismaService, config: ConfigService);
    list(): Promise<{
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
    create(input: CreateGlobalKeyInput): Promise<{
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
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
    toggleActive(id: string): Promise<{
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
    updateStrategy(strategy: string): Promise<{
        id: string;
        updatedAt: Date;
        strategy: string;
    }>;
    selectRoutedKey(provider?: string): Promise<{
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
    } | null>;
    private getOrCreateRoutingConfig;
    private publicFormat;
    private preview;
    private encrypt;
    private decrypt;
    private secret;
}
export {};
