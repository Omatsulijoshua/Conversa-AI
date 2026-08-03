import { PrismaService } from '../prisma/prisma.service';
export declare class AgentService {
    private prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        tone: string | null;
        industry: string | null;
        instructions: string | null;
        voiceId: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    findAll(tenantId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        tone: string | null;
        industry: string | null;
        instructions: string | null;
        voiceId: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        tone: string | null;
        industry: string | null;
        instructions: string | null;
        voiceId: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
    } | null>;
    update(tenantId: string, id: string, data: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
    remove(tenantId: string, id: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    private defaultBusinessRules;
}
