"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpenCheck,
  Bot,
  ClipboardList,
  Film,
  PhoneCall,
  Play,
  Settings2,
  Sparkles,
  CheckCircle2,
  Code2,
  Globe,
  MessageSquare,
  HelpCircle,
  Cpu
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

const videoExamples = [
  'Creating your first support agent',
  'Setting business rules without writing prompts',
  'Connecting a phone number to Conversa AI',
];

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<'api' | 'twilio' | 'telnyx' | 'asterisk' | 'apps'>('api');

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-white">Developer <span className="text-indigo-500">Documentation</span></h1>
        <p className="text-slate-400 text-lg max-w-3xl">
          Integrate Conversa AI with web widgets, phone numbers, custom SIP trunks, self-hosted hardware, or social voice channels.
        </p>
      </div>

      {/* Grid: Quick Steps & Video Placeholders */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 glass-card rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-indigo-600/20">
              <Sparkles className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI Setup Checklist</h2>
              <p className="text-sm text-slate-500">Train your agent model first.</p>
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
            <h2 className="text-xl font-bold text-white">Video Tutorials</h2>
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
                  <p className="text-xs text-slate-500 mt-1">Video walkthrough placeholder.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Integration Selector Tabs */}
      <div className="glass-card rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-emerald-600/20">
            <PhoneCall className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Integration Channels</h2>
            <p className="text-sm text-slate-500">Pick an integration channel to view setup instructions.</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2.5 border-b border-white/10 pb-6 mb-8">
          <button
            onClick={() => setActiveTab('api')}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'api' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/5 hover:bg-white/10 text-slate-400'
            }`}
          >
            <Code2 className="w-4 h-4" /> 1. Direct API & WebRTC
          </button>
          <button
            onClick={() => setActiveTab('twilio')}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'twilio' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/5 hover:bg-white/10 text-slate-400'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> 2. Twilio (Calls/SMS/WA)
          </button>
          <button
            onClick={() => setActiveTab('telnyx')}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'telnyx' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/5 hover:bg-white/10 text-slate-400'
            }`}
          >
            <Globe className="w-4 h-4" /> 3. Telnyx TeXML
          </button>
          <button
            onClick={() => setActiveTab('asterisk')}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'asterisk' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/5 hover:bg-white/10 text-slate-400'
            }`}
          >
            <Cpu className="w-4 h-4" /> 4. Self-Hosted PBX (Asterisk)
          </button>
          <button
            onClick={() => setActiveTab('apps')}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'apps' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/5 hover:bg-white/10 text-slate-400'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> 5. Calling Apps (Discord/Zoom)
          </button>
        </div>

        {/* Tab Contents */}
        <div className="space-y-6">
          {activeTab === 'api' && (
            <div className="space-y-6 animate-slide-up">
              <h3 className="text-xl font-bold text-white">Option 1: Direct API & WebRTC (Free Internet Calls)</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Build your own user interface and call or chat directly inside your mobile application or website using internet data. WebRTC/API connections incur no telecom carrier costs.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                <div className="p-6 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                  <h4 className="font-bold text-indigo-400 text-sm">Start a Conversation Session</h4>
                  <pre className="bg-black/60 p-4 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`POST /api/v1/conversation/start
Headers:
  x-api-key: YOUR_API_KEY
  Content-Type: application/json
Body:
  {
    "agentId": "YOUR_AGENT_ID"
  }`}
                  </pre>
                </div>

                <div className="p-6 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                  <h4 className="font-bold text-indigo-400 text-sm">Send a message and get response</h4>
                  <pre className="bg-black/60 p-4 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`POST /api/v1/conversation/message
Headers:
  x-api-key: YOUR_API_KEY
  Content-Type: application/json
Body:
  {
    "sessionId": "SESSION_ID_FROM_START",
    "text": "Hello, is my package ready?"
  }`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'twilio' && (
            <div className="space-y-6 animate-slide-up">
              <h3 className="text-xl font-bold text-white">Option 2: Connect Twilio Phone Numbers, SMS, and WhatsApp</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Connect your active Twilio phone numbers and messaging channels to route phone calls, SMS, and WhatsApp messages to your AI agents automatically.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="p-6 bg-black/30 border border-white/10 rounded-2xl space-y-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-xs">1</div>
                  <h4 className="font-bold text-white text-sm">Live Voice Calls</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Under Twilio Phone Number settings, go to the <strong>Voice & Fax</strong> section. Set the <strong>A CALL COMES IN</strong> webhook to:
                  </p>
                  <code className="block bg-black/60 p-2.5 rounded-lg text-[10px] text-indigo-300 font-mono break-all select-all">
                    https://conversa-backend-6bou.onrender.com/api/v1/voice/telephony/inbound
                  </code>
                </div>

                <div className="p-6 bg-black/30 border border-white/10 rounded-2xl space-y-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-650 flex items-center justify-center font-bold text-xs">2</div>
                  <h4 className="font-bold text-white text-sm">SMS Messages</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Under Twilio Phone Number settings, go to the <strong>Messaging</strong> section. Set the <strong>A MESSAGE COMES IN</strong> webhook to:
                  </p>
                  <code className="block bg-black/60 p-2.5 rounded-lg text-[10px] text-indigo-300 font-mono break-all select-all">
                    https://conversa-backend-6bou.onrender.com/api/v1/webhooks/twilio/messaging
                  </code>
                </div>

                <div className="p-6 bg-black/30 border border-white/10 rounded-2xl space-y-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-650 flex items-center justify-center font-bold text-xs">3</div>
                  <h4 className="font-bold text-white text-sm">WhatsApp Chats</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Go to <strong>Messaging &gt; Try it out &gt; WhatsApp Sandbox</strong> or your approved Sender settings. Set the incoming message webhook to:
                  </p>
                  <code className="block bg-black/60 p-2.5 rounded-lg text-[10px] text-indigo-300 font-mono break-all select-all">
                    https://conversa-backend-6bou.onrender.com/api/v1/webhooks/twilio/messaging
                  </code>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'telnyx' && (
            <div className="space-y-6 animate-slide-up">
              <h3 className="text-xl font-bold text-white">Option 3: Connect Telnyx (Free Test Phone Numbers)</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Telnyx offers $10 free credits on registration to claim a real test phone number. Because Conversa supports standard TeXML endpoints, Telnyx routes calls directly to the AI without needing extra software.
              </p>

              <div className="bg-indigo-950/20 border border-indigo-500/20 p-6 rounded-2xl space-y-4">
                <h4 className="font-bold text-indigo-300 text-sm">Setup Instructions:</h4>
                <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-400 leading-relaxed">
                  <li>Sign up at <a href="https://telnyx.com" target="_blank" className="text-indigo-400 underline">Telnyx.com</a> and get your $10 free credits.</li>
                  <li>Purchase a test number under <strong>Numbers &gt; Search & Buy Numbers</strong>.</li>
                  <li>Go to <strong>Voice & Fax &gt; Programmable Voice</strong>. Under the <strong>TeXML</strong> tab, click <strong>Create TeXML Application</strong>.</li>
                  <li>In the <strong>Details</strong> tab of your new TeXML Application, set the <strong>Webhook URL</strong> to:
                    <code className="block bg-black/60 p-2.5 mt-2 rounded-lg text-[10px] text-indigo-300 font-mono break-all select-all">
                      https://conversa-backend-6bou.onrender.com/api/v1/voice/telephony/inbound
                    </code>
                  </li>
                  <li>Go to <strong>My Numbers</strong>, click <strong>Edit</strong> on your number, select <strong>TeXML Application</strong> under connection, and assign your new App.</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'asterisk' && (
            <div className="space-y-6 animate-slide-up">
              <h3 className="text-xl font-bold text-white">Option 4: Self-Hosted SIP PBX Gateways (Asterisk/Verizon/GSM Hardware)</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                If you are a telecom provider (like Verizon or MTN) or want to host a local physical GSM hardware gateway using SIM cards, you can route standard SIP connections to Conversa.
              </p>

              <div className="p-6 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                <h4 className="font-bold text-indigo-400 text-sm">Asterisk Dialplan configuration (`extensions.conf`)</h4>
                <p className="text-xs text-slate-400">
                  Configure Asterisk to answer incoming SIP lines and run an AGI script (or call a custom API wrapper) to pass audio streams directly to Conversa's voice endpoints:
                </p>
                <pre className="bg-black/60 p-4 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`[incoming-sip-carrier]
exten => _+X.,1,NoOp(Incoming SIP call from carrier)
 same => n,Answer()
 same => n,Playback(connecting-conversa-ai)
 ; Forward audio stream using SIP WebSockets or AGI to your NestJS server
 same => n,AGI(agi://conversa-backend-6bou.onrender.com/voice-gateway)
 same => n,Hangup()`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'apps' && (
            <div className="space-y-6 animate-slide-up">
              <h3 className="text-xl font-bold text-white">Option 5: Social / Calling Apps (Discord, Zoom, Google Meet)</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                You can hook Conversa AI into external meeting rooms and group calls to act as a participant.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-black/30 border border-white/10 rounded-2xl space-y-3">
                  <h4 className="font-bold text-white text-sm">🎮 Discord Voice Bot</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Create a Discord bot application using <code>discord.js</code> or <code>discord.py</code>. Join a voice channel, capture the voice audio stream, pipe the PCM buffers to the Conversa API, and play the returned TTS audio chunks back to the voice channel.
                  </p>
                </div>

                <div className="p-6 bg-black/30 border border-white/10 rounded-2xl space-y-3">
                  <h4 className="font-bold text-white text-sm">📹 Zoom & Google Meet Integration</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Connect Conversa to Zoom rooms via **SIP Audio Join**. Register a virtual SIP room participant in Zoom, and point its SIP configuration to your Asterisk server, which relays the microphone/speaker stream to Conversa AI.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
