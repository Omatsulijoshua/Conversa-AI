"use client";

import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import {
  Bot,
  CheckCircle2,
  Clock,
  Loader2,
  MessageSquareText,
  PlayCircle,
  Send,
  Sparkles,
  UserCircle,
  Wand2,
} from 'lucide-react';

type Agent = {
  id: string;
  name: string;
  tone?: string;
  industry?: string;
  voiceId?: string;
};

type Message = {
  role: 'assistant' | 'user';
  content: string;
};

export default function PlaygroundPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Train a demo support agent, then send a customer message to test the call handling flow.' },
  ]);
  const [input, setInput] = useState('Hi, I need help with a refund for my order.');
  const [loading, setLoading] = useState(true);
  const [training, setTraining] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    try {
      const data = await apiRequest('/agent/config');
      setAgents(data);
      if (data[0]?.id) setSelectedAgentId(data[0].id);
    } catch (err: any) {
      setError(err.message || 'Could not load agents');
    } finally {
      setLoading(false);
    }
  }

  async function trainDemoAgent() {
    setTraining(true);
    setError('');
    try {
      const result = await apiRequest('/training/bootstrap', {
        method: 'POST',
        body: JSON.stringify({ businessName: 'Conversa' }),
      });
      await loadAgents();
      setSelectedAgentId(result.agent.id);
      setSessionId('');
      setInput(result.testPrompt);
      setMessages([
        {
          role: 'assistant',
          content: `${result.agent.name} is trained with refund, login, escalation, greeting, and closing policies. Send the test customer message when ready.`,
        },
      ]);
    } catch (err: any) {
      setError(err.message || 'Training failed');
    } finally {
      setTraining(false);
    }
  }

  async function getSession() {
    if (sessionId) return sessionId;
    const started = await apiRequest('/conversation/start', {
      method: 'POST',
      body: JSON.stringify({ agentId: selectedAgentId }),
    });
    setSessionId(started.sessionId);
    return started.sessionId;
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !selectedAgentId || sending) return;

    const customerText = input.trim();
    setInput('');
    setSending(true);
    setError('');
    setMessages(prev => [...prev, { role: 'user', content: customerText }]);

    try {
      const activeSessionId = await getSession();
      const reply = await apiRequest('/conversation/message', {
        method: 'POST',
        body: JSON.stringify({ sessionId: activeSessionId, message: customerText }),
      });
      setMessages(prev => [...prev, { role: 'assistant', content: reply.response }]);
    } catch (err: any) {
      setError(err.message || 'Message failed');
    } finally {
      setSending(false);
    }
  }

  const selectedAgent = agents.find(agent => agent.id === selectedAgentId);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col animate-fade-in">
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-white">Agent <span className="text-indigo-500">Test Room</span></h1>
          <p className="text-slate-400">Train the starter support agent and test customer calls as chat.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedAgentId}
            onChange={event => {
              setSelectedAgentId(event.target.value);
              setSessionId('');
            }}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500"
          >
            {agents.length === 0 ? <option>No agents yet</option> : null}
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>{agent.name}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={trainDemoAgent}
            disabled={training}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all disabled:opacity-60"
          >
            {training ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
            Train Demo Agent
          </button>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="flex-1 flex gap-6 overflow-hidden">
        <div className="flex-1 glass-card rounded-[2rem] border border-white/10 bg-white/5 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">{selectedAgent?.name || 'No agent selected'}</p>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Ready to test
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <Clock className="w-3 h-3" />
              <span>{sessionId ? 'Live session' : 'New session'}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-hide">
            {messages.map((msg, index) => (
              <div key={`${msg.role}-${index}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[82%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center border border-white/5 ${
                    msg.role === 'user' ? 'bg-slate-800' : 'bg-indigo-600/20 text-indigo-400'
                  }`}>
                    {msg.role === 'user' ? <UserCircle className="w-6 h-6 text-slate-400" /> : <Sparkles className="w-5 h-5" />}
                  </div>
                  <div className={`p-5 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-sm'
                      : 'bg-white/5 text-slate-200 border border-white/10 rounded-tl-sm'
                  }`}>
                    <p className="text-sm leading-relaxed font-medium">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {sending ? (
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                Agent is answering
              </div>
            ) : null}
          </div>

          <div className="p-5 bg-slate-900/50 border-t border-white/5">
            <form onSubmit={handleSendMessage} className="flex items-center gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={event => setInput(event.target.value)}
                  placeholder="Type a customer request"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || !selectedAgentId || sending}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                >
                  {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="w-80 space-y-5 hidden lg:block">
          <div className="glass-card p-6 rounded-2xl border border-white/10 bg-white/5">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Training Status</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-slate-200">Support policies loaded</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageSquareText className="w-5 h-5 text-indigo-400" />
                <span className="text-sm text-slate-200">Conversation capture enabled</span>
              </div>
              <div className="flex items-center gap-3">
                <PlayCircle className="w-5 h-5 text-cyan-400" />
                <span className="text-sm text-slate-200">Ready for test calls</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10 bg-white/5">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Agent Profile</h3>
            <div className="flex gap-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-600/20 flex items-center justify-center">
                <Bot className="w-6 h-6 text-indigo-300" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold truncate">{selectedAgent?.name || 'Untrained agent'}</p>
                <p className="text-xs text-slate-400 truncate">{selectedAgent?.tone || 'Warm support voice'}</p>
                <p className="text-xs text-slate-500 mt-1">{selectedAgent?.industry || 'customer support'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
