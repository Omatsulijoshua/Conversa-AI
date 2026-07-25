"use client";

import { useState } from 'react';
import { useEffect } from 'react';
import { apiRequest } from '@/lib/api';
import { 
  Settings, 
  Globe, 
  Bell, 
  CreditCard, 
  Shield, 
  Webhook,
  User,
  Plus,
  Trash2,
  ExternalLink,
  BrainCircuit,
  Loader2,
  CheckCircle2,
  KeyRound
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [aiProviders, setAiProviders] = useState<any[]>([]);
  const [supportedProviders, setSupportedProviders] = useState<string[]>([]);
  const [providerForm, setProviderForm] = useState({
    provider: 'openai',
    label: '',
    apiKey: '',
    modelName: '',
    baseUrl: '',
    makeActive: true,
  });
  const [providerLoading, setProviderLoading] = useState(false);
  const [providerSaving, setProviderSaving] = useState(false);
  const [providerError, setProviderError] = useState('');

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'ai', label: 'AI Providers', icon: BrainCircuit },
    { id: 'webhooks', label: 'Webhooks', icon: Webhook },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  useEffect(() => {
    loadAiProviders();
  }, []);

  async function loadAiProviders() {
    setProviderLoading(true);
    setProviderError('');
    try {
      const data = await apiRequest('/ai-providers');
      setAiProviders(data.providers);
      setSupportedProviders(data.supportedProviders);
    } catch (err: any) {
      setProviderError(err.message || 'Failed to load AI providers');
    } finally {
      setProviderLoading(false);
    }
  }

  async function saveProvider(e: React.FormEvent) {
    e.preventDefault();
    setProviderSaving(true);
    setProviderError('');
    try {
      await apiRequest('/ai-providers', {
        method: 'POST',
        body: JSON.stringify(providerForm),
      });
      setProviderForm(prev => ({ ...prev, apiKey: '', label: '', modelName: '', baseUrl: '' }));
      await loadAiProviders();
    } catch (err: any) {
      setProviderError(err.message || 'Failed to save provider key');
    } finally {
      setProviderSaving(false);
    }
  }

  async function setActiveProvider(id: string) {
    await apiRequest(`/ai-providers/${id}/active`, { method: 'PATCH' });
    await loadAiProviders();
  }

  async function deleteProvider(id: string) {
    if (!confirm('Delete this AI provider key?')) return;
    await apiRequest(`/ai-providers/${id}`, { method: 'DELETE' });
    await loadAiProviders();
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold text-white">Platform <span className="text-indigo-500">Settings</span></h1>
        <p className="text-slate-400 text-lg">Manage your account and infrastructure preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tabs Sidebar */}
        <div className="w-full lg:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {activeTab === 'general' && (
            <div className="glass-card p-8 rounded-[2.5rem] border border-white/10 bg-white/5 space-y-8">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Organization Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Organization Name</label>
                    <input type="text" defaultValue="Conversa AI Dev Team" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-indigo-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Support Email</label>
                    <input type="email" defaultValue="dev@conversa.ai" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-indigo-500 outline-none" />
                  </div>
                </div>
              </div>
              
              <div className="pt-8 border-t border-white/5 space-y-6">
                <h3 className="text-xl font-bold text-white">Platform Branding</h3>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center border border-white/10">
                    <Globe className="w-10 h-10 text-slate-600" />
                  </div>
                  <div className="space-y-2">
                    <button className="px-6 py-2.5 bg-white text-slate-950 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all">Upload Logo</button>
                    <p className="text-xs text-slate-500">Recommended size: 512x512px. PNG or SVG.</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex justify-end">
                <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-600/20">Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 bg-white/5 space-y-8">
              <div className="p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-start gap-4">
                <BrainCircuit className="w-8 h-8 text-indigo-400 flex-shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="text-white font-bold text-lg">Centralized AI Routing Enabled</h4>
                  <p className="text-sm text-indigo-200/70 leading-relaxed">
                    To ensure high availability, optimal latency, and seamless failovers, Conversa AI manages LLM credentials centrally. You do not need to supply or manage your own private API keys.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="p-6 bg-white/2 border border-white/5 rounded-2xl space-y-3">
                  <h4 className="text-white font-bold text-sm">Active Provider Access</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Your account automatically accesses the platform's routed pools for the following foundational LLMs:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {['OpenAI', 'Gemini', 'Grok', 'Anthropic', 'DeepSeek', 'Mistral', 'Groq'].map(p => (
                      <span key={p} className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/5 text-[10px] font-bold text-slate-300 uppercase tracking-wider">{p}</span>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-white/2 border border-white/5 rounded-2xl space-y-3">
                  <h4 className="text-white font-bold text-sm">Orchestration & Load Balancing</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The platform operator secures keys across multiple provider accounts. Your agents are backed by automatic:
                  </p>
                  <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
                    <li>Weighted Load Balancing (for peak demand)</li>
                    <li>Sequential Round-Robin query distribution</li>
                    <li>Automated Failover Rings (prevents outage drop-offs)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'webhooks' && (
            <div className="space-y-6">
              <div className="glass-card p-8 rounded-[2.5rem] border border-white/10 bg-white/5">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-white">Webhook Endpoints</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-500">
                    <Plus className="w-4 h-4" /> Add Endpoint
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="p-6 bg-black/40 border border-white/5 rounded-3xl flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-500/10 rounded-2xl">
                        <Globe className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-white font-bold">https://api.yourdomain.com/webhooks/conversa</p>
                        <p className="text-xs text-slate-500">Listening to: call.completed, call.failed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all"><ExternalLink className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-red-400/10 rounded-lg text-slate-500 hover:text-red-400 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 text-center space-y-6">
              <div className="p-4 bg-white/10 rounded-3xl w-fit mx-auto">
                <CreditCard className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white">Developer Pro Plan</h3>
              <p className="text-indigo-100/70 max-w-md mx-auto">
                You are currently on the Free Tier. Upgrade to Pro for high-concurrency calling and advanced voice features.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <button className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all active:scale-95 shadow-2xl">Upgrade Now</button>
                <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition-all">View Pricing</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
