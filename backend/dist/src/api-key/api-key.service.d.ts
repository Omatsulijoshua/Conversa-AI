import { PrismaService } from '../prisma/prisma.service';
export declare class ApiKeyService {
    private prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, name: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        key: string;
        lastUsed: Date | null;
        tenantId: string;
    }>;
    findAll(tenantId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        key: string;
        lastUsed: Date | null;
        tenantId: string;
    }[]>;
    remove(tenantId: string, id: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
