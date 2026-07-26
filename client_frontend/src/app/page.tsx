"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  Mic2, 
  ArrowRight, 
  Shield, 
  Zap, 
  MessageSquare, 
  Code2, 
  Globe, 
  Sparkles, 
  Check, 
  Bot, 
  Play, 
  Headphones, 
  Infinity, 
  Cpu 
} from 'lucide-react';

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const pricingPlans = [
    {
      name: 'Starter',
      description: 'Ideal for early-stage startups automating their first line of support.',
      monthlyPrice: 49,
      annualPrice: 39,
      features: [
        '1,000 Voice Minutes / month',
        '1 Cloned Voice model',
        'Centralized AI Routing fallback',
        'Standard GPT-4o-mini / Gemini Flash access',
        '100MB Knowledge Base (RAG) storage',
        'Webchat integration widget',
      ],
      popular: false,
      buttonText: 'Start Free Trial',
      color: 'border-white/10 bg-white/5 hover:border-white/20',
      badgeColor: 'bg-white/10 text-white',
    },
    {
      name: 'Growth',
      description: 'Perfect for scaling businesses requiring high availability voice lines.',
      monthlyPrice: 149,
      annualPrice: 119,
      features: [
        '5,000 Voice Minutes / month',
        '5 Cloned Voice models',
        'Priority AI routing ring (low-latency)',
        'Access to Pro models (GPT-4o, Gemini Pro)',
        '1GB Knowledge Base (RAG) storage',
        'Twilio & Custom SIP Telephony bindings',
        'Advanced Analytics & Sentiment charts',
        'Email & Slack support',
      ],
      popular: true,
      buttonText: 'Go Growth Pro',
      color: 'border-indigo-500 bg-indigo-500/5 hover:bg-indigo-500/10 shadow-2xl shadow-indigo-500/10',
      badgeColor: 'bg-indigo-600 text-white',
    },
    {
      name: 'Enterprise',
      description: 'For high-volume operations requiring custom SLA, security, and dedicated voices.',
      monthlyPrice: 'Custom',
      annualPrice: 'Custom',
      features: [
        'Unlimited Voice Minutes',
        'Unlimited Cloned Voice models',
        'Dedicated custom voice training team',
        'Custom local LLM fine-tuning options',
        'Unlimited Knowledge Base RAG storage',
        'Direct Database replica access',
        'Dedicated Solutions Engineer',
        '99.9% Uptime SLA',
      ],
      popular: false,
      buttonText: 'Contact Enterprise Sales',
      color: 'border-white/10 bg-white/5 hover:border-white/20',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 overflow-x-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute top-[40%] right-[10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Conversa AI" className="h-10 w-auto object-contain" />
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="#architecture" className="hover:text-white transition-colors">Architecture</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold hover:text-indigo-400 transition-colors">Log in</Link>
          <Link href="/signup" className="px-5 py-2.5 bg-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-500/20">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center relative">
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Centralized AI Routing & Neural Voice Engine</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] bg-gradient-to-b from-white via-white to-slate-500 bg-clip-text text-transparent">
            Automate Customer Calls With <span className="text-indigo-500 italic">Human-Like</span> AI
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed">
            Deploy cognitive voice and chat agents built on centralized routing rings. Harness ultra-low latency audio processing, instant voice cloning, and live FAQs automatically.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 rounded-2xl text-lg font-bold hover:bg-indigo-500 transition-all active:scale-95 shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-2">
              Start Building Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-lg font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              Access Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Feature Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-3xl md:text-5xl font-black">Everything You Need to Scale Support</h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">Conversa coordinates voice interfaces, AI context, and network telephony into one dashboard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 bg-white/5 hover:border-indigo-500/30 hover:bg-white/10 transition-all group space-y-6">
            <div className="p-4 bg-indigo-600 rounded-2xl w-fit shadow-xl shadow-indigo-600/20">
              <Mic2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">Neural Voice Lab</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Clone user or agent voices in seconds using custom audio samples. Synthesize fluid, emotional, and expressive speech using advanced voice cloning APIs.
            </p>
          </div>

          <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 bg-white/5 hover:border-purple-500/30 hover:bg-white/10 transition-all group space-y-6">
            <div className="p-4 bg-purple-600 rounded-2xl w-fit shadow-xl shadow-purple-600/20">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">Autonomous Agents</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Train agents with custom business guidelines, support scripts, and FAQs. Agents search local database records (RAG) to ensure answers are always factual.
            </p>
          </div>

          <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 bg-white/5 hover:border-emerald-500/30 hover:bg-white/10 transition-all group space-y-6">
            <div className="p-4 bg-emerald-600 rounded-2xl w-fit shadow-xl shadow-emerald-600/20">
              <Cpu className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">Centralized AI Routing</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Zero configuration required. All agents leverage central provider pools featuring failover redundancy, round-robin requests, and peak demand load balancing.
            </p>
          </div>
        </div>
      </section>

      {/* Telephony Banner */}
      <section id="architecture" className="max-w-7xl mx-auto px-6 py-12">
        <div className="p-8 md:p-12 rounded-[2.5rem] border border-white/10 bg-gradient-to-r from-indigo-950/40 to-slate-900/40 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <Globe className="w-3.5 h-3.5" /> Twilio SIP Integration
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white">Connect to Any Real Telephone Line</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Conversa includes built-in webhook handlers compatible with Twilio SIP trunks. Point your Twilio number to our inbound voice webhooks to answer customer calls instantly.
            </p>
          </div>
          <Link href="/signup" className="flex items-center gap-2 px-6 py-4 bg-white text-slate-950 rounded-2xl font-bold hover:bg-slate-100 transition-all shadow-xl shadow-white/10 whitespace-nowrap">
            Build Telephony Agent <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Subscription Pricing Ladder */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-black">Simple, Scale-as-You-Grow Pricing</h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">Choose a plan configured for your business traffic. Save 20% on annual billing cycles.</p>
          
          {/* Monthly/Annual Switch */}
          <div className="flex items-center justify-center gap-3 pt-6">
            <span className={`text-sm font-semibold transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Monthly Billing</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="w-14 h-8 bg-slate-800 rounded-full p-1 transition-all relative border border-white/10"
            >
              <div className={`w-5 h-5 bg-indigo-500 rounded-full transition-all ${billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-semibold transition-colors flex items-center gap-2 ${billingCycle === 'annual' ? 'text-white' : 'text-slate-500'}`}>
              Annual Billing
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.name} 
              className={`p-8 rounded-[2.5rem] border flex flex-col justify-between transition-all relative ${plan.color}`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-8 px-4 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest">
                  Most Popular
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">{plan.name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed min-h-[32px]">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1 py-4 border-y border-white/5">
                  <span className="text-5xl font-black text-white">
                    {typeof plan.monthlyPrice === 'number' 
                      ? `$${billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice}`
                      : plan.monthlyPrice}
                  </span>
                  {typeof plan.monthlyPrice === 'number' && (
                    <span className="text-slate-500 text-xs font-semibold">/ month</span>
                  )}
                </div>

                <ul className="space-y-3.5 text-xs text-slate-400">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Link 
                  href="/signup" 
                  className={`block text-center w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
                    plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/10'
                      : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2.5 opacity-60">
            <img src="/logo.png" alt="Conversa AI" className="h-6 w-auto object-contain" />
            <span className="font-bold text-sm">© 2026</span>
          </div>
          <div className="flex gap-8 text-xs text-slate-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/status" className="hover:text-white transition-colors">System Status</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
