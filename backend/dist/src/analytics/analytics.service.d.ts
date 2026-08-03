import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getUsage(tenantId: string): Promise<{
        metric: string;
        total: number | null;
    }[]>;
    getCalls(tenantId: string): Promise<({
        agent: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        tenantId: string;
        summary: string | null;
        agentId: string;
        sid: string;
        from: string;
        to: string;
        duration: number | null;
        status: string;
        transcript: import("@prisma/client/runtime/client").JsonValue | null;
        outcome: string | null;
    })[]>;
    getPerformance(tenantId: string): Promise<{
        avgLatency: string;
        successRate: string;
        avgDuration: string;
    }>;
    getUsageOverTime(tenantId: string): Promise<{
        name: string;
        requests: number;
        minutes: number;
    }[]>;
}
