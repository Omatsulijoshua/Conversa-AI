"use client";

import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';
import { 
  Users, 
  Search, 
  Edit3, 
  Cpu, 
  Loader2, 
  RefreshCw, 
  Check, 
  AlertCircle,
  X,
  CreditCard,
  Settings,
  ShieldAlert
} from 'lucide-react';

interface Developer {
  id: string;
  name: string;
  email: string;
  plan: string;
  usageLimit: number;
  usageUsed: number;
  agentsCount: number;
  callsCount: number;
  createdAt: string;
}

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal Edit States
  const [editingDev, setEditingDev] = useState<Developer | null>(null);
  const [editPlan, setEditPlan] = useState('Starter');
  const [editLimit, setEditLimit] = useState(1000);
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadDevelopers();
  }, []);

  async function loadDevelopers() {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('admin/developers');
      setDevelopers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch developers');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenEdit = (dev: Developer) => {
    setEditingDev(dev);
    setEditPlan(dev.plan);
    setEditLimit(dev.usageLimit);
    setSuccessMsg('');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDev) return;

    setUpdating(true);
    setSuccessMsg('');
    try {
      const updated = await apiRequest(`admin/developers/${editingDev.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          plan: editPlan,
          usageLimit: editLimit
        }),
      });

      // Update state local list
      setDevelopers(prev => prev.map(d => d.id === editingDev.id ? { 
        ...d, 
        plan: editPlan, 
        usageLimit: editLimit 
      } : d));

      setSuccessMsg('Developer settings updated successfully!');
      setTimeout(() => {
        setEditingDev(null);
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Failed to update developer settings');
    } finally {
      setUpdating(false);
    }
  };

  // Filter query
  const filteredDevs = developers.filter(dev => 
    dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dev.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Summary Metrics
  const totalDevs = developers.length;
  const planStarter = developers.filter(d => d.plan === 'Starter').length;
  const planGrowth = developers.filter(d => d.plan === 'Growth').length;
  const planEnterprise = developers.filter(d => d.plan === 'Enterprise').length;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Users className="w-10 h-10 text-indigo-500" />
            Developer Accounts
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Manage platform accounts, subscription tiers, and monthly message usage limits.</p>
        </div>
        <button 
          onClick={loadDevelopers}
          className="flex items-center gap-2 py-3 px-4 bg-zinc-950 border border-white/5 rounded-xl hover:bg-zinc-900 text-slate-400 hover:text-white transition-all text-sm font-semibold active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Reload List
        </button>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-zinc-950/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -z-10" />
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Registrations</h3>
          <p className="text-3xl font-black text-white mt-2">{totalDevs}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-zinc-950/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -z-10" />
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Starter Plan</h3>
          <p className="text-3xl font-black text-emerald-400 mt-2">{planStarter}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-zinc-950/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl -z-10" />
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Growth Plan</h3>
          <p className="text-3xl font-black text-amber-400 mt-2">{planGrowth}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-zinc-950/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl -z-10" />
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Enterprise Plan</h3>
          <p className="text-3xl font-black text-purple-400 mt-2">{planEnterprise}</p>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="glass-card rounded-[2rem] border border-white/5 bg-zinc-950/20 overflow-hidden">
        {/* Table Search Header */}
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-950/40">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              className="w-full bg-zinc-950/80 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Showing {filteredDevs.length} of {totalDevs} accounts
          </span>
        </div>

        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            <p className="text-slate-400 text-sm">Fetching registered developers...</p>
          </div>
        ) : error ? (
          <div className="p-20 flex flex-col items-center justify-center text-center gap-3">
            <AlertCircle className="w-12 h-12 text-red-400" />
            <h3 className="text-white font-bold text-lg">Error Loading Developers</h3>
            <p className="text-slate-500 text-sm max-w-sm">{error}</p>
          </div>
        ) : filteredDevs.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-center gap-3">
            <Users className="w-12 h-12 text-zinc-700" />
            <h3 className="text-zinc-500 font-bold text-lg">No Developers Found</h3>
            <p className="text-zinc-600 text-sm">No registered developer accounts match your query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-xs text-slate-500 font-bold uppercase tracking-wider bg-zinc-950/30">
                  <th className="py-4 px-6">Developer info</th>
                  <th className="py-4 px-6">Plan tier</th>
                  <th className="py-4 px-6">Monthly message usage</th>
                  <th className="py-4 px-6 text-center">AI Agents</th>
                  <th className="py-4 px-6 text-center">Calls</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDevs.map((dev) => {
                  const percentUsed = Math.min(100, Math.round((dev.usageUsed / dev.usageLimit) * 100));
                  let progressBarColor = 'bg-indigo-600';
                  if (percentUsed >= 90) progressBarColor = 'bg-red-500';
                  else if (percentUsed >= 75) progressBarColor = 'bg-amber-500';

                  return (
                    <tr key={dev.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-5 px-6">
                        <div className="font-semibold text-white">{dev.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{dev.email}</div>
                        <div className="text-[10px] text-slate-500 mt-1 font-medium">Joined {new Date(dev.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                          dev.plan === 'Enterprise' 
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                            : dev.plan === 'Growth'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {dev.plan}
                        </span>
                      </td>
                      <td className="py-5 px-6 max-w-xs">
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <span className="font-semibold text-slate-300">{dev.usageUsed} <span className="text-slate-500">/ {dev.usageLimit} msg</span></span>
                          <span className={`font-bold ${percentUsed >= 90 ? 'text-red-400' : 'text-slate-400'}`}>{percentUsed}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className={`h-full ${progressBarColor} transition-all duration-500`} 
                            style={{ width: `${percentUsed}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-5 px-6 text-center text-sm font-semibold text-white">
                        {dev.agentsCount}
                      </td>
                      <td className="py-5 px-6 text-center text-sm font-semibold text-white">
                        {dev.callsCount}
                      </td>
                      <td className="py-5 px-6 text-right">
                        <button 
                          onClick={() => handleOpenEdit(dev)}
                          className="p-2 bg-zinc-900 border border-white/5 rounded-xl hover:bg-zinc-800 text-slate-400 hover:text-white transition-all inline-flex items-center gap-1.5 text-xs font-bold active:scale-95"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit Rate
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating Dialog Modal for Editing Plan & Limit */}
      {editingDev && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-fade-in">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative">
            <button 
              onClick={() => setEditingDev(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-500" />
                Edit Developer Limits
              </h2>
              <p className="text-slate-400 text-xs mt-1 font-medium">Modify account settings for <span className="text-white font-bold">{editingDev.name}</span></p>
            </div>

            {successMsg ? (
              <div className="py-8 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/20">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-emerald-400 font-bold">Updated successfully!</h3>
                <p className="text-slate-500 text-xs">Closing modal dialog...</p>
              </div>
            ) : (
              <form onSubmit={handleSaveEdit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Subscription Plan</label>
                  <select 
                    className="w-full bg-black border border-zinc-800 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                    value={editPlan}
                    onChange={(e) => setEditPlan(e.target.value)}
                  >
                    <option value="Starter">Starter Plan ($49/mo)</option>
                    <option value="Growth">Growth Plan ($149/mo)</option>
                    <option value="Enterprise">Enterprise Plan (Custom)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Monthly Message Limit</label>
                  <input 
                    type="number" 
                    required
                    min={1}
                    className="w-full bg-black border border-zinc-800 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                    value={editLimit}
                    onChange={(e) => setEditLimit(Number(e.target.value))}
                  />
                  <p className="text-[10px] text-slate-500 ml-1">Limit resets automatically on the billing cycle.</p>
                </div>

                <button 
                  type="submit"
                  disabled={updating}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all active:scale-95 shadow-xl shadow-indigo-600/20 disabled:opacity-60"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving changes...
                    </>
                  ) : (
                    <>
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
