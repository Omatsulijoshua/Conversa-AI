"use client";

import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';
import { 
  Shield, 
  Settings2, 
  Database, 
  Webhook, 
  Key, 
  Mail, 
  Lock, 
  Globe,
  Save,
  Cpu,
  CreditCard,
  Plus,
  Trash2,
  Loader2,
  RefreshCw,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');

  // AI Routing States
  const [strategy, setStrategy] = useState('weighted');
  const [globalKeys, setGlobalKeys] = useState<any[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(true);
  const [savingStrategy, setSavingStrategy] = useState(false);
  const [addingKey, setAddingKey] = useState(false);
  const [errorKeys, setErrorKeys] = useState('');
  const [form, setForm] = useState({
    provider: 'openai',
    label: '',
    apiKey: '',
    modelName: '',
    baseUrl: '',
    weight: 1
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Settings2 },
    { id: 'ai', label: 'AI Routing', icon: Cpu },
    { id: 'billing', label: 'Billing Rates', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'infrastructure', label: 'Infrastructure', icon: Database },
  ];

  useEffect(() => {
    if (activeTab === 'ai') {
      loadKeys();
    }
  }, [activeTab]);

  async function loadKeys() {
    setLoadingKeys(true);
    setErrorKeys('');
    try {
      const data = await apiRequest('admin/global-keys');
      setGlobalKeys(data.keys);
      setStrategy(data.strategy);
    } catch (err: any) {
      setErrorKeys(err.message || 'Failed to load global keys');
    } finally {
      setLoadingKeys(false);
    }
  }

  async function updateStrategy(newStrategy: string) {
    setSavingStrategy(true);
    try {
      await apiRequest('admin/global-keys/strategy', {
        method: 'POST',
        body: JSON.stringify({ strategy: newStrategy }),
      });
      setStrategy(newStrategy);
    } catch (err: any) {
      alert(err.message || 'Failed to update strategy');
    } finally {
      setSavingStrategy(false);
    }
  }

  async function handleAddKey(e: React.FormEvent) {
    e.preventDefault();
    if (!form.label || !form.apiKey) return;
    setAddingKey(true);
    try {
      const newKey = await apiRequest('admin/global-keys', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          weight: Number(form.weight)
        }),
      });
      setGlobalKeys(prev => [newKey, ...prev]);
      setForm({
        provider: 'openai',
        label: '',
        apiKey: '',
        modelName: '',
        baseUrl: '',
        weight: 1
      });
    } catch (err: any) {
      alert(err.message || 'Failed to register key');
    } finally {
      setAddingKey(false);
    }
  }

  async function toggleKey(id: string) {
    try {
      const updated = await apiRequest(`admin/global-keys/${id}/toggle`, {
        method: 'PATCH',
      });
      setGlobalKeys(prev => prev.map(k => k.id === id ? updated : k));
    } catch (err: any) {
      alert(err.message || 'Failed to toggle key state');
    }
  }

  async function deleteKey(id: string) {
    if (!confirm('Are you sure you want to delete this global key?')) return;
    try {
      await apiRequest(`admin/global-keys/${id}`, {
        method: 'DELETE',
      });
      setGlobalKeys(prev => prev.filter(k => k.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete global key');
    }
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">System <span className="text-indigo-500">Settings</span></h1>
        <p className="text-slate-400 text-lg">Configure global platform parameters and infrastructure</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tabs Sidebar */}
        <div className="w-full lg:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-bold">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 bg-white/5">
            {activeTab === 'general' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Platform Name</label>
                    <input type="text" defaultValue="Conversa AI" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Support Email</label>
                    <input type="email" defaultValue="support@conversa.ai" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Platform URL</label>
                  <input type="text" defaultValue="https://app.conversa.ai" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" />
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-8">
                <div className="p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl mb-6">
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    Global AI Routing Configuration
                  </h4>
                  <p className="text-sm text-indigo-200/70">
                    Configure operational parameters for routing model queries when tenants do not supply their own private API keys. You can register multiple accounts of the same provider to build resilient fallback rings.
                  </p>
                </div>

                {/* Routing Strategy Selector */}
                <div className="p-6 bg-white/2 border border-white/5 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-bold">Active Routing Strategy</h4>
                      <p className="text-xs text-slate-500">Choose how requests are shared across active keys</p>
                    </div>
                    {savingStrategy && <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'weighted', name: 'Weighted Random', desc: 'Select keys by assigned weight distribution' },
                      { id: 'round-robin', name: 'Round Robin', desc: 'Cycles through keys sequentially using execution logs' },
                      { id: 'failover', name: 'Failover Ring', desc: 'Tries first keys sequentially, falling back on errors' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => updateStrategy(opt.id)}
                        className={`p-4 rounded-xl text-left border transition-all ${
                          strategy === opt.id 
                            ? 'bg-indigo-600/20 border-indigo-500 text-white' 
                            : 'bg-black/20 border-white/5 text-slate-400 hover:border-white/10'
                        }`}
                      >
                        <p className="font-bold text-sm">{opt.name}</p>
                        <p className="text-[10px] opacity-60 mt-1">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Register New Global Key Form */}
                <form onSubmit={handleAddKey} className="p-6 bg-white/2 border border-white/5 rounded-3xl space-y-4">
                  <h4 className="text-white font-bold">Register Global Provider Key</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Provider</label>
                      <select
                        value={form.provider}
                        onChange={(e) => setForm({ ...form, provider: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none text-sm"
                      >
                        {['openai', 'gemini', 'grok', 'anthropic', 'deepseek', 'mistral', 'openrouter', 'groq'].map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key Label (e.g. Primary OpenAI)</label>
                      <input
                        type="text"
                        value={form.label}
                        onChange={(e) => setForm({ ...form, label: e.target.value })}
                        placeholder="Label"
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Secret API Key</label>
                      <input
                        type="password"
                        value={form.apiKey}
                        onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
                        placeholder="sk-proj-..."
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Model Name Override (Optional)</label>
                      <input
                        type="text"
                        value={form.modelName}
                        onChange={(e) => setForm({ ...form, modelName: e.target.value })}
                        placeholder="e.g. gpt-4o-mini"
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Base URL Override (Optional)</label>
                      <input
                        type="text"
                        value={form.baseUrl}
                        onChange={(e) => setForm({ ...form, baseUrl: e.target.value })}
                        placeholder="e.g. https://api.openai.com/v1"
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Load Weight (1 - 100)</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={form.weight}
                        onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={addingKey}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 disabled:opacity-60 transition-all flex items-center gap-2"
                    >
                      {addingKey ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      Add Key
                    </button>
                  </div>
                </form>

                {/* Registered Keys List */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-white font-bold">Active Global Key Rings</h4>
                    <button onClick={loadKeys} className="p-2 hover:bg-white/5 rounded-full transition-all">
                      <RefreshCw className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>

                  {errorKeys && (
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 text-xs">
                      {errorKeys}
                    </div>
                  )}

                  {loadingKeys ? (
                    <div className="py-12 flex justify-center">
                      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    </div>
                  ) : globalKeys.length > 0 ? (
                    <div className="grid gap-4">
                      {globalKeys.map((key) => (
                        <div key={key.id} className="p-5 bg-white/2 border border-white/5 rounded-2xl hover:bg-white/5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <span className="px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 text-[10px] font-bold uppercase">{key.provider}</span>
                              <h5 className="text-white font-bold text-sm">{key.label}</h5>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400 text-xs mt-1">
                              <span>Preview: <code className="bg-black/40 px-1.5 py-0.5 rounded">{key.keyPreview}</code></span>
                              {key.modelName && <span>Model: <span className="text-slate-300">{key.modelName}</span></span>}
                              {strategy === 'weighted' && <span>Weight: <span className="text-slate-300">{key.weight}</span></span>}
                              {key.lastUsed && <span>Last Used: <span className="text-slate-500">{new Date(key.lastUsed).toLocaleTimeString()}</span></span>}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {/* Toggle Switch */}
                            <button onClick={() => toggleKey(key.id)} className="transition-all hover:scale-105">
                              {key.isActive ? (
                                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                                  <ToggleRight className="w-5 h-5 text-emerald-400" />
                                  Active
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold bg-slate-800/20 border border-white/5 px-3 py-1.5 rounded-xl">
                                  <ToggleLeft className="w-5 h-5 text-slate-500" />
                                  Inactive
                                </div>
                              )}
                            </button>

                            {/* Delete button */}
                            <button onClick={() => deleteKey(key.id)} className="p-2.5 hover:bg-red-600/20 text-slate-400 hover:text-red-400 rounded-xl transition-all border border-transparent hover:border-red-500/20">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 border border-dashed border-white/10 rounded-3xl text-center text-slate-500 text-sm">
                      No global AI provider keys registered yet. Fill out the form above to add one.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-white mb-6">Pricing & Rate Tiers</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { tier: 'Standard', rate: '$0.02 / min', color: 'bg-blue-600' },
                    { tier: 'Pro', rate: '$0.015 / min', color: 'bg-indigo-600' },
                    { tier: 'Enterprise', rate: 'Custom', color: 'bg-emerald-600' },
                  ].map((p, i) => (
                    <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-3xl text-center">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{p.tier}</p>
                      <p className="text-2xl font-bold text-white">{p.rate}</p>
                    </div>
                  ))}
                </div>
                <div className="p-6 border border-dashed border-white/10 rounded-3xl flex items-center justify-center text-slate-500 hover:bg-white/2 cursor-pointer transition-all">
                  + Add Custom Pricing Tier
                </div>
              </div>
            )}

            {activeTab === 'general' && (
              <div className="mt-12 pt-8 border-t border-white/5 flex justify-end">
                <button className="btn-primary flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/20">
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
