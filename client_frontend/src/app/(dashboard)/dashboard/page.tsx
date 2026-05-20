"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Zap, 
  Mic2, 
  MessageSquare, 
  TrendingUp, 
  Key, 
  Globe, 
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
  <div className="glass-card p-6 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
        <TrendingUp className="w-4 h-4" />
        {trend}
      </span>
    </div>
    <div className="space-y-1">
      <p className="text-slate-400 text-sm">{label}</p>
      <h3 className="text-3xl font-bold text-white">{value}</h3>
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [usageSeries, setUsageSeries] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function loadDashboardData() {
      try {
        const [usageData, seriesData] = await Promise.all([
          apiRequest('/analytics/usage'),
          apiRequest('/analytics/usage/series')
        ]);
        
        const usageObj = usageData.reduce((acc: any, curr: any) => {
          acc[curr.metric] = curr.total;
          return acc;
        }, {});

        setStats(usageObj);
        setUsageSeries(seriesData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-950 min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-white">Developer <span className="text-indigo-500">Dashboard</span></h1>
          <p className="text-slate-400 text-lg">Monitor your AI infrastructure in real-time</p>
        </div>
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
          Generate API Key
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Zap} 
          label="Total Requests" 
          value={stats?.messages ? `${(stats.messages / 1000).toFixed(1)}k` : '0'} 
          trend="+14%" 
          color="bg-indigo-600" 
        />
        <StatCard 
          icon={Mic2} 
          label="Voice Minutes" 
          value={stats?.voice_minutes || '0'} 
          trend="+8%" 
          color="bg-purple-600" 
        />
        <StatCard 
          icon={MessageSquare} 
          label="Chat Messages" 
          value={stats?.messages || '0'} 
          trend="+22%" 
          color="bg-pink-600" 
        />
        <StatCard 
          icon={ShieldCheck} 
          label="Service Health" 
          value="99.9%" 
          trend="Stable" 
          color="bg-emerald-600" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-8 rounded-3xl border border-white/10 bg-white/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white">Usage Analytics</h3>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-slate-400 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usageSeries}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="requests" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRequests)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-white/10 bg-white/5 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6">Service Distribution</h3>
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">LLM Processing</span>
                <span className="text-white font-medium">65%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[65%]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Voice Synthesis</span>
                <span className="text-white font-medium">25%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[25%]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">STT Transcriptions</span>
                <span className="text-white font-medium">10%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-pink-500 w-[10%]" />
              </div>
            </div>
          </div>
          <div className="mt-8 p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl">
            <p className="text-sm text-indigo-300">You've used 82% of your free tier credits. <Link href="/billing" className="underline font-semibold">Upgrade now</Link></p>
          </div>
        </div>
      </div>

      {/* Recent Activity / Active Keys */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-8 rounded-3xl border border-white/10 bg-white/5">
          <h3 className="text-xl font-bold text-white mb-6">Active API Keys</h3>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-800 rounded-lg">
                    <Key className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Production_Key_{i}</p>
                    <p className="text-xs text-slate-500">Created 2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-400 px-2 py-1 bg-emerald-400/10 rounded-full">Active</span>
                  <button className="p-2 hover:bg-white/5 rounded-lg transition-all text-slate-400">
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-white/10 bg-white/5">
          <h3 className="text-xl font-bold text-white mb-6">Recent Inbound Calls</h3>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-800 rounded-lg">
                    <Globe className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">+1 (555) 000-000{i}</p>
                    <p className="text-xs text-slate-500">Duration: 2m 14s</p>
                  </div>
                </div>
                <span className="text-sm text-slate-400">14:2{i} PM</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
