"use client";

import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { 
  BarChart3, 
  Calendar, 
  Download, 
  Filter,
  PhoneIncoming,
  MessageSquare,
  Clock,
  CircleDollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const CallLogItem = ({ id, number, duration, cost, status, agent }: any) => (
  <tr className="border-b border-white/5 hover:bg-white/2 transition-all">
    <td className="py-4 px-4 text-xs font-mono text-slate-500">{id.substring(0, 8)}...</td>
    <td className="py-4 px-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-white font-medium">{number || 'Unknown'}</span>
      </div>
    </td>
    <td className="py-4 px-4 text-sm text-slate-400">{agent?.name || 'Default Agent'}</td>
    <td className="py-4 px-4 text-sm text-slate-400">{duration || '0m 0s'}</td>
    <td className="py-4 px-4">
      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        status === 'completed' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'
      }`}>
        {status}
      </span>
    </td>
    <td className="py-4 px-4 text-sm text-white font-mono">${cost || '0.00'}</td>
  </tr>
);

export default function AnalyticsPage() {
  const [calls, setCalls] = useState<any[]>([]);
  const [series, setSeries] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function loadAnalytics() {
      try {
        const [callsData, seriesData, usageData] = await Promise.all([
          apiRequest('/analytics/calls'),
          apiRequest('/analytics/usage/series'),
          apiRequest('/analytics/usage')
        ]);
        
        setCalls(callsData);
        setSeries(seriesData);
        
        const usageObj = usageData.reduce((acc: any, curr: any) => {
          acc[curr.metric] = curr.total;
          return acc;
        }, {});
        setStats(usageObj);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-950 min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-white">Advanced <span className="text-indigo-500">Analytics</span></h1>
          <p className="text-slate-400 text-lg">Measure and optimize your agent performance</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all">
            <Calendar className="w-4 h-4" />
            Last 7 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-white/10 bg-white/5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-indigo-600/20">
              <PhoneIncoming className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
              <ArrowUpRight className="w-3 h-3" /> 12%
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Calls</p>
          <h3 className="text-2xl font-bold text-white mt-1">{calls.length}</h3>
        </div>
        <div className="glass-card p-6 rounded-3xl border border-white/10 bg-white/5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-purple-600/20">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
            <span className="flex items-center gap-1 text-red-400 text-xs font-bold">
              <ArrowDownRight className="w-3 h-3" /> 4%
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Avg Duration</p>
          <h3 className="text-2xl font-bold text-white mt-1">2m 45s</h3>
        </div>
        <div className="glass-card p-6 rounded-3xl border border-white/10 bg-white/5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-pink-600/20">
              <MessageSquare className="w-6 h-6 text-pink-400" />
            </div>
            <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
              <ArrowUpRight className="w-3 h-3" /> 28%
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Chat Msgs</p>
          <h3 className="text-2xl font-bold text-white mt-1">{stats?.messages || '0'}</h3>
        </div>
        <div className="glass-card p-6 rounded-3xl border border-white/10 bg-white/5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-emerald-600/20">
              <CircleDollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="flex items-center gap-1 text-slate-500 text-xs font-bold">
              Stable
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Spend</p>
          <h3 className="text-2xl font-bold text-white mt-1">${((stats?.messages || 0) * 0.002).toFixed(2)}</h3>
        </div>
      </div>

      <div className="glass-card p-8 rounded-[2.5rem] border border-white/10 bg-white/5">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl font-bold text-white">Call vs Message Volume</h3>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-500 rounded-full" />
              <span className="text-xs text-slate-400">Calls</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full" />
              <span className="text-xs text-slate-400">Messages</span>
            </div>
          </div>
        </div>
        <div className="h-[350px]">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid #ffffff10', borderRadius: '16px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="requests" name="Requests" stroke="#6366f1" strokeWidth={4} dot={false} />
                <Line type="monotone" dataKey="minutes" name="Minutes" stroke="#a855f7" strokeWidth={4} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] border border-white/10 bg-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Recent Call Logs</h3>
          <button className="text-sm text-indigo-400 font-bold flex items-center gap-2 hover:text-indigo-300">
            <Filter className="w-4 h-4" />
            Advanced Filters
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/2">
                <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Session ID</th>
                <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Number</th>
                <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Agent</th>
                <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Duration</th>
                <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Cost</th>
              </tr>
            </thead>
            <tbody>
              {calls.length > 0 ? (
                calls.map((call) => (
                  <CallLogItem 
                    key={call.id}
                    id={call.id}
                    number={call.from}
                    agent={call.agent}
                    duration={call.duration}
                    status={call.status}
                    cost={call.cost}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">No calls found in the selected period.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
