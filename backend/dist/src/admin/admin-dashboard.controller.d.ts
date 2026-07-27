import { ConfigService } from '@nestjs/config';
import { AdminDashboardService } from './admin-dashboard.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class AdminDashboardController {
    private readonly adminDashboardService;
    private readonly config;
    private readonly prisma;
    constructor(adminDashboardService: AdminDashboardService, config: ConfigService, prisma: PrismaService);
    login(body: any): Promise<{
        token: string;
    }>;
    getOverview(adminToken?: string): Promise<{
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
        activeAgents: {
            id: string;
            name: string;
            initials: string;
            status: string;
            callsToday: number;
            industry: string | null;
        }[];
    }>;
    getDevelopers(adminToken?: string): Promise<{
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
    updateDeveloper(id: string, body: any, adminToken?: string): Promise<{
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
