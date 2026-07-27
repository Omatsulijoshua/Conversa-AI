import { PrismaService } from '../prisma/prisma.service';
export declare class AdminDashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getOverview(): Promise<{
        stats: {
            totalMessages: number;
            voiceMinutes: number;
            avgLatencyMs: number;
            totalRevenue: number;
            callsToday: number;
            avgDurationSeconds: number;
        };
        usageSeries: {
            minutes: number;
            revenue: number;
            name: string;
            messages: number;
        }[];
        serviceDistribution: {
            percent: number;
            label: string;
            value: number;
        }[];
        latestDevelopers: {
            id: string;
            name: string;
            email: string;
            plan: any;
            initials: string;
            createdAt: Date;
        }[];
    }>;
    private buildUsageSeries;
    private buildServiceDistribution;
    private average;
    private startOfToday;
    private initials;
    getDevelopers(): Promise<{
        id: string;
        name: string;
        email: string;
        plan: any;
        usageLimit: any;
        usageUsed: number;
        agentsCount: number;
        callsCount: number;
        createdAt: Date;
    }[]>;
    updateDeveloper(id: string, plan: string, usageLimit: number): Promise<{
        id: string;
        email: string;
        name: string;
        password: string | null;
        createdAt: Date;
        updatedAt: Date;
        plan: string;
        usageLimit: number;
    }>;
}
