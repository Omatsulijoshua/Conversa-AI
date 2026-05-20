"use client";

import Link from 'next/link';
import {
  ArrowRight,
  BookOpenCheck,
  Bot,
  CheckCircle2,
  ClipboardList,
  Film,
  PhoneCall,
  Play,
  RadioTower,
  Route,
  Settings2,
  Sparkles,
} from 'lucide-react';

const trainingSteps = [
  {
    title: 'Create an agent',
    text: 'Choose a name, goal, and voice. Conversa adds starter call rules automatically.',
    href: '/agents',
    icon: Bot,
  },
  {
    title: 'Set business rules',
    text: 'Use the Rules button to write greetings, refund rules, escalation rules, and forbidden questions in plain English.',
    href: '/agents',
    icon: ClipboardList,
  },
  {
    title: 'Add company knowledge',
    text: 'Upload FAQs, policies, price sheets, or service notes so the agent answers with your real business information.',
    href: '/agents',
    icon: BookOpenCheck,
  },
  {
    title: 'Test conversations',
    text: 'Use the playground to test calls as chat before letting the agent handle live customers.',
    href: '/playground',
    icon: Play,
  },
];

const phoneSteps = [
  'Buy or use an existing number in Twilio, Telnyx, or another voice provider.',
  'Set the number voice webhook to your Conversa backend call endpoint.',
  'Choose which Conversa agent should answer that number.',
  'Forward your business phone line to the provider number, or port the number into the provider.',
  'Test with your own phone before sending real customers to it.',
];

const videoExamples = [
  'Creating your first support agent',
  'Setting business rules without writing prompts',
  'Connecting a phone number to Conversa AI',
];

export default function DocsPage() {
  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-white">Setup <span className="text-indigo-500">Guide</span></h1>
        <p className="text-slate-400 text-lg max-w-3xl">
          A business-friendly walkthrough for training Conversa AI, setting rules, and connecting phone calls.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 glass-card rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-indigo-600/20">
              <Sparkles className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Train the AI in 4 Steps</h2>
              <p className="text-sm text-slate-500">No developer language required.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainingSteps.map((step, index) => (
              <Link key={step.title} href={step.href} className="group p-5 rounded-2xl border border-white/10 bg-black/30 hover:bg-white/5 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shrink-0">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-300 font-bold mb-1">Step {index + 1}</p>
                    <h3 className="text-white font-bold mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{step.text}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-600 ml-auto group-hover:text-indigo-300 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-purple-600/20">
              <Film className="w-6 h-6 text-purple-300" />
            </div>
            <h2 className="text-xl font-bold text-white">Video Examples</h2>
          </div>

          <div className="space-y-4">
            {videoExamples.map((title) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
                <div className="h-28 flex items-center justify-center bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-cyan-500/20">
                  <div className="w-14 h-14 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-2xl animate-pulse">
                    <Play className="w-7 h-7 ml-1" />
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-white font-bold text-sm">{title}</p>
                  <p className="text-xs text-slate-500 mt-1">Placeholder for embedded tutorial video or motion graphic.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-emerald-600/20">
            <PhoneCall className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Connect a Phone Number</h2>
            <p className="text-sm text-slate-500">This is how Conversa takes control of calls.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {phoneSteps.map((step, index) => (
            <div key={step} className="relative p-5 rounded-2xl border border-white/10 bg-black/30">
              <div className="flex items-center justify-between mb-4">
                <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">{index + 1}</span>
                {index < phoneSteps.length - 1 ? <Route className="w-5 h-5 text-slate-600" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoCard icon={RadioTower} title="Webhook" text="Your phone provider sends incoming call events to Conversa." />
          <InfoCard icon={Settings2} title="Agent Routing" text="Conversa maps each number to the agent that should answer." />
          <InfoCard icon={PhoneCall} title="Forward or Port" text="Forward your existing line or port it into the provider later." />
        </div>

        <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5">
          <p className="text-sm text-amber-100 leading-relaxed">
            Live phone answering requires a telephony webhook module on the backend. The project already has Twilio dependencies and environment keys,
            but the production incoming-call webhook still needs to be connected before a real number can be handed to customers.
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, text }: { icon: any, title: string, text: string }) {
  return (
    <div className="p-5 rounded-2xl bg-black/30 border border-white/10">
      <Icon className="w-6 h-6 text-indigo-300 mb-4" />
      <h3 className="text-white font-bold mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{text}</p>
    </div>
  );
}
