import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getUsage(tenantId: string) {
    const usage = await this.prisma.usage.groupBy({
      by: ['metric'],
      where: { tenantId },
      _sum: {
        quantity: true,
      },
    });

    return usage.map(u => ({
      metric: u.metric,
      total: u._sum.quantity,
    }));
  }

  async getCalls(tenantId: string) {
    return this.prisma.call.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { agent: true },
    });
  }

  async getPerformance(tenantId: string) {
    // Mock performance metrics
    return {
      avgLatency: '142ms',
      successRate: '98.5%',
      avgDuration: '2.4 mins',
    };
  }

  async getUsageOverTime(tenantId: string) {
    // In a real app, you would query the DB for the last 7 days grouped by day
    // Mocking for now to match the dashboard design
    return [
      { name: 'Mon', requests: 400, minutes: 240 },
      { name: 'Tue', requests: 300, minutes: 139 },
      { name: 'Wed', requests: 200, minutes: 980 },
      { name: 'Thu', requests: 278, minutes: 390 },
      { name: 'Fri', requests: 189, minutes: 480 },
      { name: 'Sat', requests: 239, minutes: 380 },
      { name: 'Sun', requests: 349, minutes: 430 },
    ];
  }
}
