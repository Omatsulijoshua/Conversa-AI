import { PrismaService } from '../prisma/prisma.service';
export declare class WebhookService {
    private prisma;
    constructor(prisma: PrismaService);
    dispatch(tenantId: string, event: string, payload: any): Promise<void>;
    register(tenantId: string, url: string, events: string[]): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        url: string;
        events: string[];
    }>;
    findByTenant(tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        url: string;
        events: string[];
    }[]>;
    remove(tenantId: string, id: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
