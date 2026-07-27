"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Loader2,
  MessageSquare,
  PhoneCall,
  TrendingUp,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type AdminOverview = {
  stats: {
    totalMessages: number;
    voiceMinutes: number;
    avgLatencyMs: number;
    totalRevenue: number;
    callsToday: number;
    avgDurationSeconds: number;
  };
  usageSeries: Array<{
    name: string;
    messages: number;
    minutes: number;
    revenue: number;
  }>;
  serviceDistribution: Array<{
    label: string;
    value: number;
    percent: number;
  }>;
  latestDevelopers: Array<{
    id: string;
    name: string;
    email: string;
    plan: string;
    initials: string;
    createdAt: string;
  }>;
};

const statConfig = [
  { label: 'Total Messages', key: 'totalMessages', icon: MessageSquare, format: 'compact' },
  { label: 'Voice Minutes', key: 'voiceMinutes', icon: PhoneCall, format: 'number' },
  { label: 'Avg. Latency', key: 'avgLatencyMs', icon: Activity, format: 'ms' },
  { label: 'Total Revenue', key: 'totalRevenue', icon: TrendingUp, format: 'currency' },
];

export default function Dashboard() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadOverview() {
      try {
        setOverview(await apiRequest('/admin/overview'));
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    loadOverview();
  }, []);

  const hasUsage = useMemo(
    () => overview?.usageSeries.some(day => day.messages > 0 || day.minutes > 0 || day.revenue > 0),
    [overview],
  );

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-8">
        <h1 className="text-2xl font-bold mb-2">Dashboard unavailable</h1>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  const stats = overview?.stats;

  return (
    <div className="animate-fade-in">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Admin</h1>
        <p className="text-gray-400">Here's what's happening on your platform today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statConfig.map((stat) => (
          <div key={stat.key} className="glass-card p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <stat.icon className="w-6 h-6 text-indigo-400" />
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-gray-500">
                Live
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold">{formatStat((stats as any)?.[stat.key] ?? 0, stat.format)}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-8 min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold">Usage Analytics</h3>
              <p className="text-sm text-gray-500">Last 7 days from database usage rows</p>
            </div>
            <BarChart3 className="w-5 h-5 text-indigo-400" />
          </div>

          {hasUsage ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={overview?.usageSeries ?? []}>
                  <defs>
                    <linearGradient id="messagesFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" axisLine={false} tickLine={false} />
                  <YAxis stroke="#71717a" axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #ffffff12', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="messages" name="Messages" stroke="#6366f1" strokeWidth={3} fill="url(#messagesFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl">
              <BarChart3 className="w-12 h-12 text-white/10 mb-4" />
              <p className="text-gray-500">No usage records yet</p>
              <span className="text-xs text-gray-600 mt-2">Active developer traffic will populate this chart.</span>
            </div>
          )}
        </div>

        <div className="glass-card p-8">
          <h3 className="text-xl font-bold mb-6">Latest Developers</h3>
          <div className="space-y-6">
            {overview?.latestDevelopers.length ? (
              overview.latestDevelopers.map((dev) => (
                <div key={dev.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
                    {dev.initials || 'DEV'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold truncate text-white">{dev.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-gray-400 truncate">{dev.email}</span>
                      <span className="inline-flex px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-indigo-600/10 text-indigo-400 border border-indigo-500/10">{dev.plan}</span>
                    </div>
                  </div>
                  <Link href="/developers" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                  </Link>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center">
                <p className="text-gray-500">No developers signed up yet.</p>
              </div>
            )}
          </div>
          <Link href="/developers" className="block text-center w-full mt-8 py-3 rounded-xl border border-white/5 hover:bg-white/5 transition-all text-sm font-medium text-slate-400 hover:text-white">
            Manage Developers
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {(overview?.serviceDistribution ?? []).map(item => (
          <div key={item.label} className="glass-card p-6">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-400">{item.label}</span>
              <span className="font-semibold">{item.percent}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500" style={{ width: `${item.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatStat(value: number, format: string) {
  if (format === 'currency') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  }
  if (format === 'compact') {
    return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
  }
  if (format === 'ms') {
    return `${Math.round(value)}ms`;
  }
  return new Intl.NumberFormat('en-US').format(value);
}
