"use client";

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { 
  Users, 
  Activity, 
  ShieldCheck, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download
} from 'lucide-react';

const globalData = [
  { name: 'Mon', revenue: 4000, usage: 2400 },
  { name: 'Tue', revenue: 3000, usage: 1398 },
  { name: 'Wed', revenue: 2000, usage: 9800 },
  { name: 'Thu', revenue: 2780, usage: 3908 },
  { name: 'Fri', revenue: 1890, usage: 4800 },
  { name: 'Sat', revenue: 2390, usage: 3800 },
  { name: 'Sun', revenue: 3490, usage: 4300 },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Platform <span className="text-indigo-500">Intelligence</span></h1>
          <p className="text-slate-400 text-lg">Global performance metrics across all tenants</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all font-medium">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all font-bold shadow-lg shadow-indigo-600/20">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Active Tenants', value: '1,284', icon: Users, trend: '+12%', color: 'bg-blue-600' },
          { label: 'System Requests', value: '84.2M', icon: Activity, trend: '+28%', color: 'bg-indigo-600' },
          { label: 'Platform Health', value: '99.98%', icon: ShieldCheck, trend: 'Optimal', color: 'bg-emerald-600' },
          { label: 'Gross Revenue', value: '$248,500', icon: DollarSign, trend: '+18%', color: 'bg-purple-600' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-3xl border border-white/10 bg-white/5">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.color} bg-opacity-20`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <span className={`text-xs font-bold ${stat.trend.includes('+') ? 'text-emerald-400' : 'text-slate-400'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-8 rounded-[2.5rem] border border-white/10 bg-white/5">
          <h3 className="text-xl font-bold text-white mb-8">Revenue Growth (USD)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={globalData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8 rounded-[2.5rem] border border-white/10 bg-white/5">
          <h3 className="text-xl font-bold text-white mb-8">Token Usage vs Capacity</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={globalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px' }} />
                <Bar dataKey="usage" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] border border-white/10 bg-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5">
          <h3 className="text-xl font-bold text-white">Top Performing Tenants</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/2">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Tenant</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Agents</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Total Usage</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Billing Plan</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { name: 'Acme Corp', agents: 12, usage: '2.4M tokens', plan: 'Enterprise', status: 'Active' },
                { name: 'Global Logistics', agents: 45, usage: '18.2M tokens', plan: 'Enterprise', status: 'Active' },
                { name: 'TechStart Inc', agents: 3, usage: '450k tokens', plan: 'Pro', status: 'Active' },
                { name: 'Finovate', agents: 8, usage: '1.1M tokens', plan: 'Pro', status: 'Delinquent' },
              ].map((tenant, i) => (
                <tr key={i} className="hover:bg-white/2 transition-all">
                  <td className="py-4 px-6 text-white font-bold">{tenant.name}</td>
                  <td className="py-4 px-6 text-slate-400">{tenant.agents}</td>
                  <td className="py-4 px-6 text-indigo-400 font-mono">{tenant.usage}</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-indigo-600/10 text-indigo-400 rounded-lg text-[10px] font-bold uppercase">
                      {tenant.plan}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                      tenant.status === 'Active' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'
                    }`}>
                      {tenant.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
