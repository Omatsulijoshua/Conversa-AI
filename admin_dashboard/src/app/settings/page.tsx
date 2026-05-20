"use client";

import { useState } from 'react';
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
  CreditCard
} from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Settings2 },
    { id: 'ai', label: 'AI Models', icon: Cpu },
    { id: 'billing', label: 'Billing Rates', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'infrastructure', label: 'Infrastructure', icon: Database },
  ];

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
                    Model Orchestration
                  </h4>
                  <p className="text-sm text-indigo-200/70">Configure which LLM providers are available to tenants and set default routing paths.</p>
                </div>
                <div className="space-y-4">
                  {['OpenAI GPT-4o', 'Claude 3.5 Sonnet', 'Gemini 1.5 Pro', 'Llama 3 (Groq)'].map((model) => (
                    <div key={model} className="flex items-center justify-between p-4 bg-white/2 border border-white/5 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                        <span className="text-white font-bold">{model}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  ))}
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

            <div className="mt-12 pt-8 border-t border-white/5 flex justify-end">
              <button className="btn-primary flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/20">
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
