import { ConfigService } from '@nestjs/config';
import { AdminDashboardService } from './admin-dashboard.service';
export declare class AdminDashboardController {
    private readonly adminDashboardService;
    private readonly config;
    constructor(adminDashboardService: AdminDashboardService, config: ConfigService);
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
}
