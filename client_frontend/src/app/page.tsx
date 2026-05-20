"use client";

import Link from 'next/link';
import { Mic2, ArrowRight, Shield, Zap, MessageSquare, Code2, Globe, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      {/* Hero Section */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Mic2 className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">Conversa <span className="text-indigo-500">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#api" className="hover:text-white transition-colors">API Docs</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold hover:text-indigo-400 transition-colors">Log in</Link>
          <Link href="/signup" className="px-5 py-2.5 bg-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-500/20">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-32">
        <div className="text-center space-y-8 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -z-10" />
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>Next-Gen Voice & Chat Infrastructure</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1]">
            Build AI that <span className="text-indigo-500 italic">Converses</span> Like a Human
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-slate-400 leading-relaxed">
            API-first infrastructure for real-time voice synthesis, intelligent chat agents, and high-fidelity speech recognition. Scale from prototype to production in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 rounded-2xl text-lg font-bold hover:bg-indigo-500 transition-all active:scale-95 shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-2">
              Start Building Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/docs" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-lg font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              View Documentation
              <Code2 className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-48">
          <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 bg-white/5 hover:border-indigo-500/40 transition-all group">
            <div className="p-4 bg-indigo-600 rounded-2xl w-fit mb-8 shadow-xl shadow-indigo-600/20">
              <Mic2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Neural Voice Lab</h3>
            <p className="text-slate-400 leading-relaxed">
              Synthesize human-like speech with adjustable tone, pace, and emotion using our state-of-the-art neural engines.
            </p>
          </div>
          <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 bg-white/5 hover:border-purple-500/40 transition-all group">
            <div className="p-4 bg-purple-600 rounded-2xl w-fit mb-8 shadow-xl shadow-purple-600/20">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Autonomous Agents</h3>
            <p className="text-slate-400 leading-relaxed">
              Deploy intelligent chat and voice agents that understand context, intent, and complex multi-turn conversations.
            </p>
          </div>
          <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 bg-white/5 hover:border-emerald-500/40 transition-all group">
            <div className="p-4 bg-emerald-600 rounded-2xl w-fit mb-8 shadow-xl shadow-emerald-600/20">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Ultra-Low Latency</h3>
            <p className="text-slate-400 leading-relaxed">
              Global infrastructure optimized for sub-100ms response times, ensuring fluid real-time interactions.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Mic2 className="w-5 h-5" />
            <span className="font-bold">Conversa AI © 2026</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/status" className="hover:text-white transition-colors">System Status</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
