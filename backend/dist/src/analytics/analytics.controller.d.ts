import type { Request } from 'express';
import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getUsage(req: Request): Promise<{
        metric: string;
        total: number | null;
    }[]>;
    getUsageSeries(req: Request): Promise<{
        name: string;
        requests: number;
        minutes: number;
    }[]>;
    getCalls(req: Request): Promise<({
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
    getPerformance(req: Request): Promise<{
        avgLatency: string;
        successRate: string;
        avgDuration: string;
    }>;
}
