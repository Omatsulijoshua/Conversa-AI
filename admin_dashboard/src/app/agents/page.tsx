"use client";

import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Bot,
  MessageCircle,
  Phone,
  Zap
} from 'lucide-react';

const initialAgents = [
  { id: '1', name: 'Customer Support Bot', industry: 'E-commerce', tone: 'Helpful', type: 'Chat + Voice', status: 'Active' },
  { id: '2', name: 'Lead Qualifier', industry: 'Real Estate', tone: 'Professional', type: 'Voice Only', status: 'Paused' },
  { id: '3', name: 'Banking Assistant', industry: 'Finance', tone: 'Formal', type: 'Chat Only', status: 'Active' },
];

export default function Agents() {
  const [agents] = useState(initialAgents);

  return (
    <div className="animate-fade-in">
      <header className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Agents</h1>
          <p className="text-gray-400">Configure and deploy intelligent conversation agents.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Agent
        </button>
      </header>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search agents..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <button className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
          <Filter className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="glass-card p-6 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 flex items-center justify-center">
                <Bot className="w-8 h-8 text-indigo-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${agent.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {agent.status}
                </span>
                <button className="p-1.5 hover:bg-white/5 rounded-lg text-gray-500">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-1">{agent.name}</h3>
            <p className="text-sm text-gray-400 mb-6">{agent.industry} • {agent.tone} Tone</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg">
                  <MessageCircle className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Chat</p>
                  <p className="text-xs font-semibold">Enabled</p>
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg">
                  <Phone className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Voice</p>
                  <p className="text-xs font-semibold">Enabled</p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
              <button className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Configure Agent
              </button>
              <span className="text-[10px] text-gray-500 font-mono">ID: {agent.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
