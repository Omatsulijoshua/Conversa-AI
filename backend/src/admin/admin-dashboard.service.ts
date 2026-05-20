import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DAY_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class AdminDashboardService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 6);

    const [usageTotals, usageRows, agents, callsToday, allCalls] = await Promise.all([
      this.prisma.usage.groupBy({
        by: ['metric'],
        _sum: { quantity: true },
      }),
      this.prisma.usage.findMany({
        where: { timestamp: { gte: start } },
        select: { metric: true, quantity: true, timestamp: true },
        orderBy: { timestamp: 'asc' },
      }),
      this.prisma.agent.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: {
          calls: {
            where: { createdAt: { gte: this.startOfToday() } },
            select: { id: true },
          },
        },
      }),
      this.prisma.call.count({
        where: { createdAt: { gte: this.startOfToday() } },
      }),
      this.prisma.call.findMany({
        select: { duration: true },
      }),
    ]);

    const totals = usageTotals.reduce<Record<string, number>>((acc, item) => {
      acc[item.metric] = item._sum.quantity ?? 0;
      return acc;
    }, {});

    const totalMessages = totals.messages ?? 0;
    const voiceMinutes = Math.round((totals.voice_minutes ?? 0) + (totals.stt_seconds ?? 0) / 60);
    const ttsCharacters = totals.tts_chars ?? 0;
    const estimatedRevenue = totalMessages * 0.002 + voiceMinutes * 0.05 + ttsCharacters * 0.00003;
    const avgDurationSeconds = this.average(allCalls.map(call => call.duration ?? 0));

    return {
      stats: {
        totalMessages,
        voiceMinutes,
        avgLatencyMs: 0,
        totalRevenue: estimatedRevenue,
        callsToday,
        avgDurationSeconds,
      },
      usageSeries: this.buildUsageSeries(usageRows, start),
      serviceDistribution: this.buildServiceDistribution(totals),
      activeAgents: agents.map(agent => ({
        id: agent.id,
        name: agent.name,
        initials: this.initials(agent.name),
        status: 'Active',
        callsToday: agent.calls.length,
        industry: agent.industry,
      })),
    };
  }

  private buildUsageSeries(rows: Array<{ metric: string; quantity: number; timestamp: Date }>, start: Date) {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start.getTime() + index * DAY_MS);
      const key = date.toISOString().slice(0, 10);
      return {
        key,
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        messages: 0,
        minutes: 0,
        revenue: 0,
      };
    });

    const byKey = new Map(days.map(day => [day.key, day]));
    for (const row of rows) {
      const key = row.timestamp.toISOString().slice(0, 10);
      const day = byKey.get(key);
      if (!day) continue;

      if (row.metric === 'messages') {
        day.messages += row.quantity;
        day.revenue += row.quantity * 0.002;
      }
      if (row.metric === 'voice_minutes') {
        day.minutes += row.quantity;
        day.revenue += row.quantity * 0.05;
      }
      if (row.metric === 'stt_seconds') {
        day.minutes += row.quantity / 60;
      }
      if (row.metric === 'tts_chars') {
        day.revenue += row.quantity * 0.00003;
      }
    }

    return days.map(({ key, ...day }) => ({
      ...day,
      minutes: Number(day.minutes.toFixed(1)),
      revenue: Number(day.revenue.toFixed(2)),
    }));
  }

  private buildServiceDistribution(totals: Record<string, number>) {
    const values = [
      { label: 'Messages', value: totals.messages ?? 0 },
      { label: 'Voice Minutes', value: (totals.voice_minutes ?? 0) + (totals.stt_seconds ?? 0) / 60 },
      { label: 'TTS Characters', value: totals.tts_chars ?? 0 },
    ];
    const total = values.reduce((sum, item) => sum + item.value, 0);

    return values.map(item => ({
      ...item,
      percent: total > 0 ? Math.round((item.value / total) * 100) : 0,
    }));
  }

  private average(values: number[]) {
    const valid = values.filter(value => value > 0);
    if (!valid.length) return 0;
    return valid.reduce((sum, value) => sum + value, 0) / valid.length;
  }

  private startOfToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  private initials(name: string) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase())
      .join('');
  }
}

