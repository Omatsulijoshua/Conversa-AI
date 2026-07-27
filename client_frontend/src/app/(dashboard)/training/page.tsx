"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import {
  ArrowRight,
  BookOpenCheck,
  Bot,
  CheckCircle2,
  Circle,
  ClipboardList,
  KeyRound,
  Loader2,
  Mic2,
  PlayCircle,
  Rocket,
  ShieldCheck,
} from 'lucide-react';

type Agent = { id: string; name: string };
type TrainingStatus = {
  score: number;
  completed: number;
  total: number;
  readyForProduction: boolean;
  knowledge: { collections: number; chunks: number };
  checks: Array<{ id: string; label: string; complete: boolean; href: string }>;
};

const stages = [
  { id: 'rules', title: 'Define rules', text: 'Set scope, tone, verification, compliance, fallback, and escalation behavior.', icon: ClipboardList, href: '/agents' },
  { id: 'knowledge', title: 'Add knowledge', text: 'Upload approved policies, product information, FAQs, and operating procedures.', icon: BookOpenCheck, href: '/agents' },
  { id: 'voice', title: 'Choose a voice', text: 'Select an ElevenLabs voice, paste a voice ID, or safely clone an authorized voice.', icon: Mic2, href: '/agents' },
  { id: 'test', title: 'Test edge cases', text: 'Test normal requests, missing information, angry callers, sensitive data, and handoff.', icon: PlayCircle, href: '/playground' },
];

export default function TrainingPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentId, setAgentId] = useState('');
  const [status, setStatus] = useState<TrainingStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/agent/config')
      .then((data) => {
        setAgents(data);
        if (data[0]?.id) setAgentId(data[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!agentId) return setStatus(null);
    setLoading(true);
    apiRequest(`/training/status/${agentId}`)
      .then(setStatus)
      .finally(() => setLoading(false));
  }, [agentId]);

  if (loading && !status) {
    return <div className="min-h-[70vh] grid place-items-center"><Loader2 className="w-8 h-8 text-indigo-400 animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-indigo-300 font-bold mb-2">Production onboarding</p>
          <h1 className="text-4xl font-bold text-white">Agent <span className="text-indigo-500">Training Center</span></h1>
          <p className="mt-2 text-slate-400 max-w-2xl">Train with approved rules, grounded knowledge, a production voice, and evidence from test conversations.</p>
        </div>
        <select value={agentId} onChange={(event) => setAgentId(event.target.value)} className="min-w-64 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500">
          {agents.length ? agents.map((agent) => <option key={agent.id} value={agent.id}>{agent.name}</option>) : <option>Create an agent first</option>}
        </select>
      </div>

      {!agents.length ? (
        <div className="glass-card p-10 rounded-[2rem] border border-white/10 bg-white/5 text-center">
          <Bot className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">Create your first agent</h2>
          <p className="text-slate-400 mt-2 mb-6">An agent is required before rules, knowledge, voice, and tests can be connected.</p>
          <Link href="/agents" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold">Create agent <ArrowRight className="w-4 h-4" /></Link>
        </div>
      ) : status ? (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 glass-card p-8 rounded-[2rem] border border-white/10 bg-white/5">
              <div className="flex items-center justify-between gap-4 mb-7">
                <div>
                  <h2 className="text-2xl font-bold text-white">Training readiness</h2>
                  <p className="text-sm text-slate-400">{status.completed} of {status.total} production requirements complete</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${status.readyForProduction ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>
                  {status.readyForProduction ? 'Ready to launch' : 'Training required'}
                </span>
              </div>
              <div className="h-3 rounded-full bg-black/30 overflow-hidden mb-8"><div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-emerald-400 transition-all" style={{ width: `${status.score}%` }} /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stages.map((stage) => {
                  const check = status.checks.find((item) => item.id === stage.id);
                  return (
                    <Link href={stage.href} key={stage.id} className="group p-5 rounded-2xl border border-white/10 bg-black/25 hover:border-indigo-500/40 transition-all">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${check?.complete ? 'bg-emerald-500/15' : 'bg-indigo-500/15'}`}><stage.icon className={`w-5 h-5 ${check?.complete ? 'text-emerald-400' : 'text-indigo-300'}`} /></div>
                        <div className="flex-1"><h3 className="text-white font-bold">{stage.title}</h3><p className="text-sm text-slate-400 mt-1 leading-relaxed">{stage.text}</p></div>
                        {check?.complete ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Circle className="w-5 h-5 text-slate-600" />}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="space-y-5">
              <div className="glass-card p-6 rounded-[2rem] border border-white/10 bg-gradient-to-br from-indigo-600/15 to-purple-600/10">
                <ShieldCheck className="w-8 h-8 text-indigo-300 mb-4" />
                <h3 className="text-xl font-bold text-white">Launch gate</h3>
                <p className="text-sm text-slate-400 mt-2">Do not connect live customers until every requirement is complete and escalation has been tested.</p>
                <Link href="/playground" className="mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-indigo-600 text-white font-bold">Run test conversation <PlayCircle className="w-4 h-4" /></Link>
              </div>
              <div className="glass-card p-6 rounded-[2rem] border border-white/10 bg-white/5">
                <p className="text-xs uppercase tracking-widest font-bold text-slate-500">Knowledge index</p>
                <p className="mt-3 text-3xl font-bold text-white">{status.knowledge.chunks}</p>
                <p className="text-sm text-slate-400">{status.knowledge.collections} collections · searchable sections</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-7 rounded-[2rem] border border-white/10 bg-white/5 flex flex-col md:flex-row md:items-center gap-5">
            <div className="p-4 rounded-2xl bg-emerald-500/10"><KeyRound className="w-7 h-7 text-emerald-400" /></div>
            <div className="flex-1"><h3 className="text-xl font-bold text-white">Ready for developer integration?</h3><p className="text-sm text-slate-400 mt-1">Generate an account API key, copy it once, then start conversations using the trained agent ID.</p></div>
            <Link href="/api-keys" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-950 font-bold">Get API access <Rocket className="w-4 h-4" /></Link>
          </div>
        </>
      ) : null}
    </div>
  );
}
