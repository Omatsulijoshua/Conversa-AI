"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { 
  UserCircle, 
  Plus, 
  Settings2, 
  BrainCircuit, 
  Trash2, 
  Search, 
  X, 
  BookOpen, 
  Upload, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  ClipboardList, 
  Save, 
  Code2,
  Phone,
  Globe,
  Cpu,
  Smartphone,
  Share2,
  Check,
  Copy,
  AlertCircle,
  MessageSquare
} from 'lucide-react';

const KnowledgeModal = ({ agent, onClose }: { agent: any, onClose: () => void }) => {
  const [kbBases, setKbBases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newKbName, setNewKbName] = useState('');

  useEffect(() => {
    loadKb();
  }, []);

  async function loadKb() {
    try {
      const data = await apiRequest(`/knowledge/${agent.id}`);
      setKbBases(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateBase = async () => {
    if (!newKbName) return;
    try {
      await apiRequest(`/knowledge/${agent.id}`, {
        method: 'POST',
        body: JSON.stringify({ name: newKbName })
      });
      setNewKbName('');
      loadKb();
    } catch (err) {
      alert('Failed to create knowledge base');
    }
  };

  const handleFileUpload = async (kbId: string, e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('conversa_token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://conversa-backend-6bou.onrender.com/api/v1'}/knowledge/${kbId}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      loadKb();
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card w-full max-w-2xl p-10 rounded-[3rem] border border-white/10 bg-slate-950/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{agent.name} Knowledge</h3>
              <p className="text-slate-400 text-sm">Train your agent with custom documents</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="e.g. Refund Policy, Company FAQ" 
              value={newKbName}
              onChange={(e) => setNewKbName(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500 transition-all"
            />
            <button 
              onClick={handleCreateBase}
              className="px-8 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Base
            </button>
          </div>

          <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
            {loading ? (
              <div className="py-20 flex justify-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              </div>
            ) : kbBases.length > 0 ? (
              kbBases.map((kb) => (
                <div key={kb.id} className="p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 transition-all group">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-800 rounded-xl">
                        <FileText className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-white font-bold">{kb.name}</p>
                        <p className="text-xs text-slate-500">{kb._count.chunks} Knowledge Chunks Indexed</p>
                      </div>
                    </div>
                    <label className="cursor-pointer">
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(kb.id, e)}
                        disabled={uploading}
                      />
                      <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 text-indigo-400 rounded-xl text-xs font-bold hover:bg-indigo-600/20 transition-all">
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        Upload Text/PDF
                      </div>
                    </label>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-500 bg-white/2 rounded-3xl border border-dashed border-white/10">
                No knowledge bases found. Create one to start training.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const defaultRules = {
  greeting: 'Hi, thanks for calling. How can I help you today?',
  tone: 'Warm, patient, clear, and natural.',
  goal: 'Resolve customer issues quickly, explain next steps, and escalate when needed.',
  businessHours: 'Monday to Friday, 9 AM to 5 PM.',
  refundPolicy: 'Ask for the order number, email, and reason. Eligible refunds are reviewed within 2 business days.',
  escalationRules: 'Escalate angry customers, billing disputes, fraud reports, legal questions, and account ownership changes.',
  collectInfo: 'Name, phone number, email, order number, and a short description of the issue.',
  neverSay: 'Do not ask for passwords, full card numbers, SSNs, or legal/medical advice.',
  closing: 'Summarize the next step and ask if there is anything else you can help with.',
};

const BusinessRulesModal = ({ agent, onClose, onSaved }: { agent: any, onClose: () => void, onSaved: () => void }) => {
  const [rules, setRules] = useState(defaultRules);
  const [mode, setMode] = useState<'basic' | 'developer'>('basic');
  const [developerInstructions, setDeveloperInstructions] = useState('');
  const [developerNotes, setDeveloperNotes] = useState('{\n  "handoffTriggers": ["angry customer", "billing dispute"],\n  "testCases": ["refund request", "forgot password"],\n  "integrations": []\n}');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const instructions = agent.instructions || '';
    setRules({
      ...defaultRules,
      tone: agent.tone || defaultRules.tone,
      goal: instructions || defaultRules.goal,
    });
    setDeveloperInstructions(instructions || buildDefaultInstructions(agent.tone || defaultRules.tone));
  }, [agent]);

  const updateRule = (key: keyof typeof defaultRules, value: string) => {
    setRules(prev => ({ ...prev, [key]: value }));
  };

  const buildInstructions = () => [
    'Business Rules for Customer Calls',
    `Greeting: ${rules.greeting}`,
    `Tone: ${rules.tone}`,
    `Main Goal: ${rules.goal}`,
    `Business Hours: ${rules.businessHours}`,
    `Refund Policy: ${rules.refundPolicy}`,
    `Escalation Rules: ${rules.escalationRules}`,
    `Information to Collect: ${rules.collectInfo}`,
    `Never Say or Ask: ${rules.neverSay}`,
    `Call Closing: ${rules.closing}`,
    'Use these rules on every conversation. If the customer asks something outside these rules, be honest, collect the right details, and escalate to a human.',
  ].join('\n\n');

  const buildDefaultInstructions = (tone: string) => [
    'Business Rules for Customer Calls',
    `Tone: ${tone}`,
    'Main Goal: Resolve customer issues quickly, explain next steps, and escalate when needed.',
    'Developer Notes: Add exact call-flow rules, webhook/tool requirements, structured outputs, and test cases here.',
  ].join('\n\n');

  const saveRules = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const instructions = mode === 'developer'
        ? `${developerInstructions.trim()}\n\nDeveloper Training Notes:\n${developerNotes.trim()}`
        : buildInstructions();
      await apiRequest(`/agent/${agent.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          tone: mode === 'developer' ? agent.tone || rules.tone : rules.tone,
          instructions,
        }),
      });
      setSaved(true);
      onSaved();
    } catch (err) {
      alert('Failed to save business rules');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8 rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{agent.name} Business Rules</h3>
              <p className="text-slate-400 text-sm">Plain-language rules for business users, with a developer option for advanced training.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="flex gap-2 mb-6 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit">
          <button
            type="button"
            onClick={() => setMode('basic')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'basic' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <ClipboardList className="w-4 h-4" />
            Simple Rules
          </button>
          <button
            type="button"
            onClick={() => setMode('developer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'developer' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Code2 className="w-4 h-4" />
            Developer
          </button>
        </div>

        {mode === 'basic' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <RuleField label="How should calls start?" value={rules.greeting} onChange={(value) => updateRule('greeting', value)} />
            <RuleField label="What should the agent sound like?" value={rules.tone} onChange={(value) => updateRule('tone', value)} />
            <RuleField label="What is the main job?" value={rules.goal} onChange={(value) => updateRule('goal', value)} large />
            <RuleField label="Business hours" value={rules.businessHours} onChange={(value) => updateRule('businessHours', value)} />
            <RuleField label="Refund or return rules" value={rules.refundPolicy} onChange={(value) => updateRule('refundPolicy', value)} large />
            <RuleField label="When should it send to a human?" value={rules.escalationRules} onChange={(value) => updateRule('escalationRules', value)} large />
            <RuleField label="What customer details should it collect?" value={rules.collectInfo} onChange={(value) => updateRule('collectInfo', value)} large />
            <RuleField label="What must it never ask or say?" value={rules.neverSay} onChange={(value) => updateRule('neverSay', value)} large />
            <RuleField label="How should calls end?" value={rules.closing} onChange={(value) => updateRule('closing', value)} large />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <label className="lg:col-span-2 space-y-2">
              <span className="text-sm font-bold text-slate-400">System instructions / prompt</span>
              <textarea
                value={developerInstructions}
                onChange={(e) => setDeveloperInstructions(e.target.value)}
                rows={16}
                className="w-full resize-none font-mono text-sm bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </label>
            <div className="space-y-5">
              <label className="space-y-2 block">
                <span className="text-sm font-bold text-slate-400">Developer JSON notes</span>
                <textarea
                  value={developerNotes}
                  onChange={(e) => setDeveloperNotes(e.target.value)}
                  rows={10}
                  className="w-full resize-none font-mono text-sm bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
                />
              </label>
              <div className="p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20">
                <h4 className="text-white font-bold mb-2">Developer examples</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>Return JSON for CRM handoff summaries.</li>
                  <li>Call a webhook when intent is appointment booking.</li>
                  <li>Escalate if confidence is low or sentiment is negative.</li>
                  <li>Write exact test cases before live phone routing.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col md:flex-row md:items-center gap-4 justify-between border-t border-white/5 pt-6">
          <p className="text-sm text-slate-500">
            These rules are saved into the agent instructions and used during every test conversation.
          </p>
          <div className="flex items-center gap-3">
            {saved && <span className="flex items-center gap-2 text-sm text-emerald-400"><CheckCircle2 className="w-4 h-4" /> Saved</span>}
            <button
              onClick={saveRules}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Rules
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RuleField = ({ label, value, onChange, large }: { label: string, value: string, onChange: (value: string) => void, large?: boolean }) => (
  <label className={large ? 'md:col-span-2 space-y-2' : 'space-y-2'}>
    <span className="text-sm font-bold text-slate-400">{label}</span>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={large ? 3 : 2}
      className="w-full resize-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
    />
  </label>
);

const ConnectModal = ({ agent, onClose, defaultTab = 'webrtc' }: { agent: any, onClose: () => void, defaultTab?: string }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [copied, setCopied] = useState(false);

  const webhookUrl = `https://conversa-backend-6bou.onrender.com/api/v1/voice/telephony/inbound/${agent.tenantId}/${agent.id}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'webrtc', label: 'WebRTC (Internet Call)', icon: Globe },
    { id: 'twilio', label: 'Twilio Voice', icon: Phone },
    { id: 'telnyx', label: 'Telnyx Voice (Free)', icon: Phone },
    { id: 'sip', label: 'SIP PBX (Asterisk)', icon: Cpu },
    { id: 'gsm', label: 'GSM Android SIM', icon: Smartphone },
    { id: 'social', label: 'Social & Meetings', icon: Share2 },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8 rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Connect {agent.name}</h3>
              <p className="text-slate-400 text-sm">Choose a calling channel and follow the setup instructions to connect your agent.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Layout: Sidebar tabs and Main content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          
          {/* Tabs column */}
          <div className="md:col-span-1 space-y-2">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left border ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-white bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content column */}
          <div className="md:col-span-3 bg-white/5 border border-white/5 rounded-3xl p-6 md:p-8 overflow-y-auto max-h-[60vh] scrollbar-hide">
            
            {activeTab === 'webrtc' && (
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-400" />
                  WebRTC In-App Calling (Zero Carrier Fees)
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Enable users to call your AI agent directly from your website or mobile application using their microphone and browser data. This option requires no phone numbers and is 100% free of carrier connection fees.
                </p>
                
                <div className="p-5 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl space-y-2">
                  <h5 className="font-bold text-white text-sm flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-indigo-400 animate-pulse" />
                    Quick Playground Test
                  </h5>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    You can test this agent's voice live right now using the **Playground** inside your Client Portal. Go to the Playground in the sidebar, select **{agent.name}** and start talking!
                  </p>
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold text-white text-sm">Developer Client Embed Script</h5>
                  <p className="text-slate-400 text-xs">Install our WebRTC SDK and paste this snippet into your frontend application to start internet calling:</p>
                  <div className="relative">
                    <pre className="p-4 bg-black/60 border border-white/10 rounded-2xl font-mono text-xs text-indigo-300 overflow-x-auto whitespace-pre-wrap">
{`import { ConversaRTC } from '@conversa/rtc-client';

const call = new ConversaRTC({
  backendUrl: 'https://conversa-backend-6bou.onrender.com',
  agentId: '${agent.id}'
});

// Start call session
call.start();

// Stop call session
call.stop();`}
                    </pre>
                    <button 
                      onClick={() => copyToClipboard(`import { ConversaRTC } from '@conversa/rtc-client';\n\nconst call = new ConversaRTC({\n  backendUrl: 'https://conversa-backend-6bou.onrender.com',\n  agentId: '${agent.id}'\n});\n\ncall.start();`)}
                      className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'twilio' && (
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Phone className="w-5 h-5 text-indigo-400" />
                  Twilio Voice Integration
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Connect a standard 10-digit virtual phone number from Twilio. When a customer dials your number, Twilio queries your Conversa agent webhook to initiate a real-time conversational voice call.
                </p>

                <div className="space-y-4">
                  <h5 className="font-bold text-white text-sm">Setup Instructions:</h5>
                  <ol className="list-decimal list-inside text-slate-300 text-xs space-y-3">
                    <li>Log in to your **Twilio Console** and buy a phone number.</li>
                    <li>Go to **Phone Numbers** &rarr; **Manage** &rarr; **Active Numbers** and select your number.</li>
                    <li>Scroll down to **Voice & Fax**. Under **A CALL COMES IN**, select **Webhook**.</li>
                    <li>Set the HTTP request type to **POST**.</li>
                    <li>Copy and paste your pre-populated webhook URL below:</li>
                  </ol>

                  <div className="flex gap-2 items-center bg-black/60 border border-white/10 rounded-2xl p-4 mt-2">
                    <span className="font-mono text-xs text-indigo-300 break-all select-all flex-1">{webhookUrl}</span>
                    <button 
                      onClick={() => copyToClipboard(webhookUrl)}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all flex-shrink-0"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'telnyx' && (
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Phone className="w-5 h-5 text-indigo-400" />
                  Telnyx Integration (Free $10 Developer Credits)
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Telnyx offers wholesale carrier rates and awards new developer accounts with a **free $10 trial credit** (no credit card required), which is perfect for claiming a free number and testing inbound/outbound calls.
                </p>

                <div className="space-y-4">
                  <h5 className="font-bold text-white text-sm">Setup Instructions:</h5>
                  <div className="grid grid-cols-1 gap-4 text-xs text-slate-300">
                    <div className="flex gap-3 items-start p-4 bg-white/2 border border-white/5 rounded-2xl">
                      <span className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0">1</span>
                      <div>
                        <p className="font-bold text-white mb-0.5">Register for Trial Credits</p>
                        <p className="text-slate-400">Go to [Telnyx](https://telnyx.com/) and register. Your account will automatically credit with $10 in trial balance.</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start p-4 bg-white/2 border border-white/5 rounded-2xl">
                      <span className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0">2</span>
                      <div>
                        <p className="font-bold text-white mb-0.5">Buy a Phone Number</p>
                        <p className="text-slate-400">Navigate to **Numbers** &rarr; **Search & Buy**. Purchase a number using your trial balance (costs about $1/month).</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start p-4 bg-white/2 border border-white/5 rounded-2xl">
                      <span className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0">3</span>
                      <div>
                        <p className="font-bold text-white mb-0.5">Create a TeXML Application</p>
                        <p className="text-slate-400">Go to **Voice & Fax** &rarr; **TeXML**, click **Create TeXML Application**, and set the Webhook URL (POST) to:</p>
                        <div className="flex gap-2 items-center bg-black/60 border border-white/10 rounded-xl p-3 mt-2">
                          <span className="font-mono text-[10px] text-indigo-300 break-all select-all flex-1">{webhookUrl}</span>
                          <button 
                            onClick={() => copyToClipboard(webhookUrl)}
                            className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-all flex-shrink-0"
                          >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start p-4 bg-white/2 border border-white/5 rounded-2xl">
                      <span className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0">4</span>
                      <div>
                        <p className="font-bold text-white mb-0.5">Link Number to TeXML App</p>
                        <p className="text-slate-400">Go to **Numbers** &rarr; **My Numbers**, configure your purchased number, set connection type to **TeXML Application**, and select your app.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sip' && (
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  Hosted SIP PBX & Trunks (Verizon, MTN, Softphones)
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Connect direct corporate phone systems, local VoIP networks, or wholesale carriers (like Verizon, MTN Business, SIP Trunks) to Conversa.
                </p>

                <div className="p-5 bg-indigo-600/15 border border-indigo-500/35 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-indigo-400 animate-pulse" />
                      Option A: Conversa Hosted SIP Gateway (No Setup Required)
                    </h5>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      ● Gateway Online
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Simply configure your wholesale SIP trunk, softphone (e.g. Linphone), or corporate PBX to register to our central Hosted SIP Proxy. Calls will instantly route to this agent:
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-[11px] font-mono text-slate-300">
                    <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
                      <span className="text-slate-500 block text-[9px] uppercase font-sans mb-0.5">SIP Registrar / Host</span>
                      <span className="text-indigo-300 break-all select-all">sip.conversa-ai.com</span>
                    </div>
                    <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
                      <span className="text-slate-500 block text-[9px] uppercase font-sans mb-0.5">SIP Port</span>
                      <span className="text-indigo-300">5060 (UDP)</span>
                    </div>
                    <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
                      <span className="text-slate-500 block text-[9px] uppercase font-sans mb-0.5">SIP Username</span>
                      <span className="text-indigo-300 select-all">conversa_usr_{agent.id.slice(0, 8)}</span>
                    </div>
                    <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
                      <span className="text-slate-500 block text-[9px] uppercase font-sans mb-0.5">SIP Password</span>
                      <span className="text-indigo-300 select-all">conversa_pass_{agent.id.slice(0, 8)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 border-t border-white/5 pt-4">
                  <h5 className="font-bold text-white text-sm">Option B: Self-Hosted Asterisk Dialplan Configuration</h5>
                  <p className="text-slate-400 text-xs">If you prefer hosting your own PBX, configure your `/etc/asterisk/extensions.conf` to route calls to Conversa:</p>
                  <div className="relative">
                    <pre className="p-4 bg-black/60 border border-white/10 rounded-2xl font-mono text-xs text-indigo-300 overflow-x-auto whitespace-pre-wrap">
{`[conversa-inbound]
exten => 2000,1,NoOp(Forwarding to Conversa AI ${agent.name})
same => n,Set(API_URL=${webhookUrl})
same => n,AGI(agi://conversa-agi.onrender.com,\${API_URL})
same => n,Hangup()`}
                    </pre>
                    <button 
                      onClick={() => copyToClipboard(`[conversa-inbound]\nexten => 2000,1,NoOp(Forwarding to Conversa AI ${agent.name})\nsame => n,Set(API_URL=${webhookUrl})\nsame => n,AGI(agi://conversa-agi.onrender.com,\${API_URL})\nsame => n,Hangup()`)}
                      className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'gsm' && (
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-indigo-400" />
                  GSM Android SIM Gateway (Self-Owned SIM Card)
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Turn a spare Android phone with a local cellular SIM card (MTN, Airtel, Safaricom, Glo, etc.) into a physical voice gateway to receive phone calls at standard local mobile rates.
                </p>

                <div className="p-5 bg-indigo-600/15 border border-indigo-500/35 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-indigo-400" />
                      Option A: Use Conversa's Hosted SIP Proxy (No Server Setup Required)
                    </h5>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      ● Registration Ready
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    You do not need to host a server! Simply register your Android gateway client (like **Sim2Sip** or **Linphone**) to our hosted SIP gateway using these credentials:
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-[11px] font-mono text-slate-300">
                    <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
                      <span className="text-slate-500 block text-[9px] uppercase font-sans mb-0.5">SIP Registrar</span>
                      <span className="text-indigo-300 break-all select-all">sip.conversa-ai.com</span>
                    </div>
                    <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
                      <span className="text-slate-500 block text-[9px] uppercase font-sans mb-0.5">SIP Port</span>
                      <span className="text-indigo-300">5060 (UDP)</span>
                    </div>
                    <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
                      <span className="text-slate-500 block text-[9px] uppercase font-sans mb-0.5">Username (SIP User)</span>
                      <span className="text-indigo-300 select-all">conversa_usr_{agent.id.slice(0, 8)}</span>
                    </div>
                    <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
                      <span className="text-slate-500 block text-[9px] uppercase font-sans mb-0.5">Secret Key (SIP Pass)</span>
                      <span className="text-indigo-300 select-all">conversa_pass_{agent.id.slice(0, 8)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-400 text-xs leading-relaxed font-semibold">
                    Note: Due to Apple's background restriction policies, GSM-to-SIP software-based client apps only function reliably on Android devices.
                  </p>
                </div>

                <div className="space-y-4 border-t border-white/5 pt-4">
                  <h5 className="font-bold text-white text-sm">Step-by-Step Device Setup Guide:</h5>
                  <div className="grid grid-cols-1 gap-4 text-xs text-slate-300">
                    <div className="p-4 bg-white/2 border border-white/5 rounded-2xl">
                      <p className="font-bold text-white mb-1">1. Download a SIP Gateway Client</p>
                      <p className="text-slate-400">Install **Linphone** or **Sim2Sip** on the Android phone that holds your MTN, Airtel, Safaricom, or Glo SIM card.</p>
                    </div>

                    <div className="p-4 bg-white/2 border border-white/5 rounded-2xl">
                      <p className="font-bold text-white mb-1">2. Register Your Phone to Conversa</p>
                      <p className="text-slate-400">Log in to the gateway client app using the **Option A** credentials displayed above.</p>
                    </div>

                    <div className="p-4 bg-white/2 border border-white/5 rounded-2xl">
                      <p className="font-bold text-white mb-1">3. Grant System Permissions</p>
                      <p className="text-slate-400">Allow the app **Microphone** access (to capture caller voice), **Phone** access (to intercept calls), and **Display Over Other Apps** (to run the gateway service in the background).</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-indigo-400" />
                  Social Messaging & Live Meeting Integrations
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Bridge your Conversa AI agent to already calling internet channels and messaging networks.
                </p>

                <div className="grid grid-cols-1 gap-6 text-xs text-slate-300">
                  <div className="p-6 bg-white/2 border border-white/5 rounded-3xl space-y-2 hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-5 h-5 text-indigo-400" />
                      <h5 className="font-bold text-white text-sm">WhatsApp & SMS Text Chats</h5>
                    </div>
                    <p className="text-slate-400">
                      Configure your WhatsApp Business Cloud API webhook or Twilio programmable SMS callback to send message payloads to:
                    </p>
                    <pre className="p-3 bg-black/60 border border-white/5 rounded-xl font-mono text-indigo-300 text-[10px] select-all">
                      https://conversa-backend-6bou.onrender.com/api/v1/webhook/whatsapp
                    </pre>
                  </div>

                  <div className="p-6 bg-white/2 border border-white/5 rounded-3xl space-y-2 hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-2 mb-1">
                      <Code2 className="w-5 h-5 text-indigo-400" />
                      <h5 className="font-bold text-white text-sm">Discord Voice Channels</h5>
                    </div>
                    <p className="text-slate-400">
                      Run a local Node.js Discord voice bot handler using the Discord.js library. Connect your bot to a server channel, collect user audio streams using the WebRTC channel, feed them to Conversa's audio endpoints, and play back the resulting voice response.
                    </p>
                  </div>

                  <div className="p-6 bg-white/2 border border-white/5 rounded-3xl space-y-2 hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-2 mb-1">
                      <Globe className="w-5 h-5 text-indigo-400" />
                      <h5 className="font-bold text-white text-sm">Zoom & Google Meet</h5>
                    </div>
                    <p className="text-slate-400">
                      Establish a SIP-to-RTMP or WebRTC meeting room bridge. Your PBX/Asterisk server dials into the meeting room as a participant, streaming the participant audio stream to the Conversa API and broadcasting the AI voice agent response back into the meeting room.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAgentKb, setSelectedAgentKb] = useState<any>(null);
  const [selectedAgentRules, setSelectedAgentRules] = useState<any>(null);
  const [selectedAgentConnect, setSelectedAgentConnect] = useState<any>(null);
  const [newAgent, setNewAgent] = useState({ name: '', type: 'Support', voice: 'Amy', integration: 'webrtc' });

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    try {
      const data = await apiRequest('/agent/config');
      setAgents(data);
    } catch (err) {
      console.error('Failed to load agents:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = async () => {
    if (!newAgent.name) return;
    try {
      const created = await apiRequest('/agent/create', {
        method: 'POST',
        body: JSON.stringify({
          name: newAgent.name,
          type: newAgent.type,
          voice: newAgent.voice
        })
      });
      setShowCreateModal(false);
      setSelectedAgentConnect({ ...created, defaultTab: newAgent.integration });
      setNewAgent({ name: '', type: 'Support', voice: 'Amy', integration: 'webrtc' });
      loadAgents();
    } catch (err) {
      alert('Failed to create agent');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return;
    try {
      await apiRequest(`/agent/${id}`, { method: 'DELETE' });
      loadAgents();
    } catch (err) {
      alert('Failed to delete agent');
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-950 min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-white">AI <span className="text-indigo-500">Agents</span></h1>
          <p className="text-slate-400 text-lg">Deploy and manage your autonomous agents</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Create New Agent
        </button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-md p-8 rounded-[2.5rem] border border-white/10 bg-slate-900">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">New Agent</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block font-medium">Agent Name</label>
                <input 
                  type="text" 
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
                  placeholder="e.g. Sales Assistant"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block font-medium">Primary Goal</label>
                <select 
                  value={newAgent.type}
                  onChange={(e) => setNewAgent({...newAgent, type: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
                >
                  <option>Support</option>
                  <option>Sales</option>
                  <option>Utility</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block font-medium">Voice Personality</label>
                <select 
                  value={newAgent.voice}
                  onChange={(e) => setNewAgent({...newAgent, voice: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
                >
                  <option>Amy</option>
                  <option>Marcus</option>
                  <option>Sophia</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block font-medium">Calling Connection Method</label>
                <select 
                  value={newAgent.integration}
                  onChange={(e) => setNewAgent({...newAgent, integration: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
                >
                  <option value="webrtc">WebRTC In-App Calling (Free)</option>
                  <option value="twilio">Twilio Programmable Voice</option>
                  <option value="telnyx">Telnyx TeXML Application (Free Credits)</option>
                  <option value="sip">Self-Hosted SIP PBX (Asterisk)</option>
                  <option value="gsm">Android GSM SIM Card Gateway</option>
                  <option value="social">Social Apps (Discord/Zoom/Meet)</option>
                </select>
              </div>
              <button 
                onClick={handleCreate}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all mt-4"
              >
                Create Agent
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedAgentKb && (
        <KnowledgeModal agent={selectedAgentKb} onClose={() => setSelectedAgentKb(null)} />
      )}

      {selectedAgentRules && (
        <BusinessRulesModal
          agent={selectedAgentRules}
          onClose={() => setSelectedAgentRules(null)}
          onSaved={loadAgents}
        />
      )}

      {selectedAgentConnect && (
        <ConnectModal 
          agent={selectedAgentConnect} 
          defaultTab={selectedAgentConnect.defaultTab || 'webrtc'}
          onClose={() => setSelectedAgentConnect(null)} 
        />
      )}

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.length > 0 ? (
          agents.map((agent) => (
            <div key={agent.id} className="glass-card rounded-[2.5rem] border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex flex-col group overflow-hidden">
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 bg-slate-800 rounded-3xl flex items-center justify-center border border-white/5 group-hover:bg-indigo-600 transition-all">
                    <UserCircle className="w-8 h-8 text-indigo-400 group-hover:text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Online</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{agent.name}</h3>
                  <p className="text-slate-500 text-sm">{agent.type || 'Custom'} Assistant</p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Voice Model</p>
                    <p className="text-sm text-indigo-400 font-semibold">{agent.voiceId || 'Default'}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Health</p>
                    <p className="text-sm text-white font-semibold">100%</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSelectedAgentKb(agent)}
                    className="p-2.5 bg-white/5 border border-white/5 text-white rounded-xl text-xs font-bold hover:bg-white/10 transition-all flex-1 flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Knowledge
                  </button>
                  <button
                    onClick={() => setSelectedAgentRules(agent)}
                    className="p-2.5 bg-indigo-600/15 border border-indigo-500/20 text-indigo-200 rounded-xl text-xs font-bold hover:bg-indigo-600/25 transition-all flex-1 flex items-center justify-center gap-1.5"
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    Rules
                  </button>
                  <button
                    onClick={() => setSelectedAgentConnect(agent)}
                    className="p-2.5 bg-emerald-600/15 border border-emerald-500/20 text-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-600/25 transition-all flex-1 flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Connect
                  </button>
                  <button 
                    onClick={() => handleDelete(agent.id)}
                    className="p-2.5 bg-red-400/5 text-red-400 hover:bg-red-400/10 rounded-xl transition-all border border-red-400/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500 glass-card rounded-3xl border border-white/5 bg-white/2">
            No agents found. Create your first AI assistant.
          </div>
        )}
      </div>

      {/* Feature Highlight */}
      <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="p-6 bg-white/10 rounded-3xl backdrop-blur-md">
            <BrainCircuit className="w-12 h-12 text-white animate-pulse" />
          </div>
          <div className="text-center md:text-left space-y-2">
            <h3 className="text-2xl font-bold text-white">Scale with Autonomous Agents</h3>
            <p className="text-indigo-100/70 max-w-xl">
              Connect your agents to external tools via Webhooks. Enable them to check inventory, book meetings, or process payments automatically.
            </p>
          </div>
          <Link href="/docs" className="md:ml-auto px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all active:scale-95 shadow-2xl text-center">
            Explore Documentation
          </Link>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-white/10 transition-all duration-700" />
      </div>
    </div>
  );
}
