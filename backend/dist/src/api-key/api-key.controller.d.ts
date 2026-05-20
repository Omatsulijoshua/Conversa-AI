import type { Request } from 'express';
import { ApiKeyService } from './api-key.service';
export declare class ApiKeyController {
    private readonly apiKeyService;
    constructor(apiKeyService: ApiKeyService);
    create(req: Request, data: {
        name: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        key: string;
        lastUsed: Date | null;
        tenantId: string;
    }>;
    findAll(req: Request): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        key: string;
        lastUsed: Date | null;
        tenantId: string;
    }[]>;
    remove(req: Request, id: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
