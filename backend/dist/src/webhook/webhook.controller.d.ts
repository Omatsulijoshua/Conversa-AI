import type { Request } from 'express';
import { WebhookService } from './webhook.service';
export declare class WebhookController {
    private readonly webhookService;
    constructor(webhookService: WebhookService);
    create(req: Request, data: {
        url: string;
        events: string[];
    }): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        url: string;
        events: string[];
    }>;
    findAll(req: Request): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        url: string;
        events: string[];
    }[]>;
    remove(req: Request, id: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
