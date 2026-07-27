"use client";

import { useState, useEffect, useRef } from 'react';
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
  Mic,
  Square,
  Copy
} from 'lucide-react';

const PRIMARY_GOALS = [
  'Customer Support',
  'Sales & Lead Qualification',
  'Appointment Booking',
  'Receptionist & Call Routing',
  'Order Tracking',
  'Technical Support',
  'FAQ & Information',
  'Billing & Payments',
  'Customer Onboarding',
  'Feedback & Surveys',
  'Collections & Reminders',
  'Other',
];

type VoiceOption = { voiceId: string; name: string; category?: string };

const DEFAULT_VOICES: VoiceOption[] = [
  { voiceId: 'Amy', name: 'Amy', category: 'Professional' },
  { voiceId: 'Marcus', name: 'Marcus', category: 'Energetic' },
  { voiceId: 'Sophia', name: 'Sophia', category: 'Friendly' },
];

const KnowledgeModal = ({ agent, onClose }: { agent: any, onClose: () => void }) => {
  const [kbBases, setKbBases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newKbName, setNewKbName] = useState('');
  const [notice, setNotice] = useState('');

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
      // Note: apiRequest needs to handle FormData or we use fetch directly
      const token = localStorage.getItem('conversa_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/knowledge/${kbId}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message || 'Upload failed');
      setNotice(`${result.filename} indexed into ${result.chunksCreated} searchable sections.`);
      loadKb();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteBase = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}" and all of its indexed sources?`)) return;
    try {
      await apiRequest(`/knowledge/${id}`, { method: 'DELETE' });
      setNotice(`${name} was deleted.`);
      loadKb();
    } catch {
      setNotice('Failed to delete this knowledge base.');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card w-full max-w-4xl max-h-[92vh] overflow-y-auto p-8 rounded-[2.5rem] border border-white/10 bg-slate-950 shadow-2xl relative">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          <div className="lg:col-span-2 space-y-6">
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
              Create collection
            </button>
          </div>
          {notice && <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-200">{notice}</div>}

          <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
            {loading ? (
              <div className="py-20 flex justify-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              </div>
            ) : kbBases.length > 0 ? (
              kbBases.map((kb) => (
                <div key={kb.id} className="p-5 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 transition-all group">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-800 rounded-xl">
                        <FileText className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-white font-bold">{kb.name}</p>
                        <p className="text-xs text-slate-500">{kb._count.chunks} indexed sections · {kb.sources?.length || 0} sources</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                    <label className="cursor-pointer">
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(kb.id, e)}
                        disabled={uploading}
                        accept=".pdf,.txt,.md,.csv,.json,application/pdf,text/plain,text/markdown,text/csv,application/json"
                      />
                      <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 text-indigo-400 rounded-xl text-xs font-bold hover:bg-indigo-600/20 transition-all">
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        Add source
                      </div>
                    </label>
                    <button onClick={() => handleDeleteBase(kb.id, kb.name)} className="p-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10" aria-label={`Delete ${kb.name}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                    </div>
                  </div>
                  {kb.sources?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                      {kb.sources.map((source: any) => (
                        <span key={source.filename} className="inline-flex items-center gap-2 rounded-lg bg-black/20 px-3 py-2 text-xs text-slate-300">
                          <FileText className="w-3.5 h-3.5 text-indigo-400" /> {source.filename}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-500 bg-white/2 rounded-3xl border border-dashed border-white/10">
                No knowledge bases found. Create one to start training.
              </div>
            )}
          </div>
          </div>
          <aside className="space-y-4">
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="font-bold text-white flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Production checklist</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>Use approved, current source documents.</li>
                <li>Separate policies, products, and FAQs.</li>
                <li>Remove passwords and sensitive customer data.</li>
                <li>Re-upload a file to replace its older version.</li>
                <li>Test common and edge-case questions.</li>
              </ul>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs uppercase tracking-widest font-bold text-slate-500">Supported sources</p>
              <p className="mt-2 text-sm text-slate-300">PDF, TXT, Markdown, CSV, and JSON up to 10 MB.</p>
              <p className="mt-3 text-xs text-slate-500">Content is split at natural paragraph and sentence boundaries with overlap for stronger retrieval.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const defaultRules = {
  greeting: 'Hi, thanks for calling. How can I help you today?',
  tone: 'Warm, patient, clear, and natural.',
  goal: 'Resolve customer issues quickly, explain next steps, and escalate when needed.',
  scope: 'Answer questions covered by the approved knowledge base. Do not invent policies, prices, availability, or account information.',
  verification: 'Before discussing or changing an account, verify the caller using the business-approved identity checks.',
  conversationFlow: 'Understand the request, confirm important details, provide one clear next step at a time, then confirm resolution.',
  businessHours: 'Monday to Friday, 9 AM to 5 PM.',
  refundPolicy: 'Ask for the order number, email, and reason. Eligible refunds are reviewed within 2 business days.',
  escalationRules: 'Escalate angry customers, billing disputes, fraud reports, legal questions, and account ownership changes.',
  collectInfo: 'Name, phone number, email, order number, and a short description of the issue.',
  neverSay: 'Do not ask for passwords, full card numbers, SSNs, or legal/medical advice.',
  fallback: 'If information is missing or confidence is low, say what you can confirm, collect the necessary details, and transfer to a human.',
  compliance: 'Follow privacy, consent, recording-disclosure, and industry regulations that apply to this business and caller location.',
  successCriteria: 'The caller receives an accurate answer or documented next step, required details are captured, and the outcome is summarized.',
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
    `Scope and Boundaries: ${rules.scope}`,
    `Identity Verification: ${rules.verification}`,
    `Conversation Flow: ${rules.conversationFlow}`,
    `Business Hours: ${rules.businessHours}`,
    `Refund Policy: ${rules.refundPolicy}`,
    `Escalation Rules: ${rules.escalationRules}`,
    `Information to Collect: ${rules.collectInfo}`,
    `Never Say or Ask: ${rules.neverSay}`,
    `Unknown or Low-Confidence Information: ${rules.fallback}`,
    `Privacy and Compliance: ${rules.compliance}`,
    `Success Criteria: ${rules.successCriteria}`,
    `Call Closing: ${rules.closing}`,
    'Rule priority: safety and compliance, identity verification, explicit business policy, knowledge-base facts, then conversational style. Never invent a fact or claim an action completed unless a tool confirms it.',
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
	              <p className="text-slate-400 text-sm">Production policy, guardrails, escalation, and measurable outcomes for every conversation.</p>
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
	            <RuleField label="Scope and boundaries" value={rules.scope} onChange={(value) => updateRule('scope', value)} large />
	            <RuleField label="Identity verification requirements" value={rules.verification} onChange={(value) => updateRule('verification', value)} large />
	            <RuleField label="Standard conversation flow" value={rules.conversationFlow} onChange={(value) => updateRule('conversationFlow', value)} large />
	            <RuleField label="Business hours" value={rules.businessHours} onChange={(value) => updateRule('businessHours', value)} />
	            <RuleField label="Refund or return rules" value={rules.refundPolicy} onChange={(value) => updateRule('refundPolicy', value)} large />
	            <RuleField label="When should it send to a human?" value={rules.escalationRules} onChange={(value) => updateRule('escalationRules', value)} large />
	            <RuleField label="What customer details should it collect?" value={rules.collectInfo} onChange={(value) => updateRule('collectInfo', value)} large />
	            <RuleField label="What must it never ask or say?" value={rules.neverSay} onChange={(value) => updateRule('neverSay', value)} large />
	            <RuleField label="Unknown or low-confidence information" value={rules.fallback} onChange={(value) => updateRule('fallback', value)} large />
	            <RuleField label="Privacy, consent, and compliance" value={rules.compliance} onChange={(value) => updateRule('compliance', value)} large />
	            <RuleField label="Definition of a successful conversation" value={rules.successCriteria} onChange={(value) => updateRule('successCriteria', value)} large />
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

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAgentKb, setSelectedAgentKb] = useState<any>(null);
  const [selectedAgentRules, setSelectedAgentRules] = useState<any>(null);
  const [newAgent, setNewAgent] = useState({ name: '', type: 'Customer Support', customGoal: '', voice: 'Amy', customVoiceId: '' });
  const [voiceOptions, setVoiceOptions] = useState<VoiceOption[]>(DEFAULT_VOICES);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSample, setVoiceSample] = useState<Blob | File | null>(null);
  const [voiceName, setVoiceName] = useState('');
  const [isCloning, setIsCloning] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    loadAgents();
    loadVoices();
  }, []);

  async function loadVoices() {
    try {
      const data = await apiRequest('/voice');
      if (data?.voices?.length) setVoiceOptions(data.voices);
    } catch (err) {
      console.error('Failed to load ElevenLabs voices:', err);
    }
  }

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
    const goal = newAgent.type === 'Other' ? newAgent.customGoal.trim() : newAgent.type;
    const voice = newAgent.voice === '__custom__' ? newAgent.customVoiceId.trim() : newAgent.voice;
    if (!goal) return alert('Please describe the primary goal.');
    if (!voice || voice === '__clone__') return alert('Please choose, enter, or clone a voice.');
    try {
      await apiRequest('/agent/create', {
        method: 'POST',
        body: JSON.stringify({ name: newAgent.name, type: goal, voice })
      });
      setShowCreateModal(false);
      setNewAgent({ name: '', type: 'Customer Support', customGoal: '', voice: voiceOptions[0]?.voiceId || 'Amy', customVoiceId: '' });
      setVoiceSample(null);
      setVoiceStatus('');
      loadAgents();
    } catch (err) {
      alert('Failed to create agent');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recordingChunksRef.current = [];
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size) recordingChunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        setVoiceSample(new Blob(recordingChunksRef.current, { type: 'audio/webm' }));
        stream.getTracks().forEach((track) => track.stop());
        setVoiceStatus('Recording ready. Give it a name, then create your voice.');
      };
      recorder.start();
      setIsRecording(true);
      setVoiceStatus('Recording… speak clearly in a quiet room.');
    } catch {
      setVoiceStatus('Microphone access was blocked. You can upload an audio file instead.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const cloneVoice = async () => {
    if (!voiceSample || !voiceName.trim()) return setVoiceStatus('Add a recording and a voice name first.');
    setIsCloning(true);
    setVoiceStatus('Creating your ElevenLabs voice…');
    const formData = new FormData();
    formData.append('file', voiceSample, voiceSample instanceof File ? voiceSample.name : 'voice-sample.webm');
    formData.append('name', voiceName.trim());
    try {
      const token = localStorage.getItem('conversa_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/voice/clone`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message || 'Voice creation failed.');
      const option = { voiceId: result.voiceId, name: result.name || voiceName.trim(), category: 'Your cloned voice' };
      setVoiceOptions((current) => [option, ...current.filter((item) => item.voiceId !== option.voiceId)]);
      setNewAgent((current) => ({ ...current, voice: option.voiceId }));
      setVoiceStatus(`${option.name} is ready and selected.`);
    } catch (err) {
      setVoiceStatus(err instanceof Error ? err.message : 'Voice creation failed.');
    } finally {
      setIsCloning(false);
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
          <div className="glass-card w-full max-w-xl max-h-[92vh] overflow-y-auto p-8 rounded-[2.5rem] border border-white/10 bg-slate-900">
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
                  {PRIMARY_GOALS.map((goal) => <option key={goal} value={goal}>{goal}</option>)}
                </select>
                {newAgent.type === 'Other' && (
                  <input
                    type="text"
                    value={newAgent.customGoal}
                    onChange={(e) => setNewAgent({...newAgent, customGoal: e.target.value})}
                    className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
                    placeholder="Describe exactly what this agent should achieve"
                  />
                )}
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block font-medium">Voice Personality</label>
                <select 
                  value={newAgent.voice}
                  onChange={(e) => setNewAgent({...newAgent, voice: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
                >
                  {voiceOptions.map((voice) => (
                    <option key={voice.voiceId} value={voice.voiceId}>
                      {voice.name}{voice.category ? ` — ${voice.category}` : ''}
                    </option>
                  ))}
                  <option value="__custom__">Use an ElevenLabs Voice ID</option>
                  <option value="__clone__">Record or upload my own voice</option>
                </select>
                {newAgent.voice === '__custom__' && (
                  <input
                    type="text"
                    value={newAgent.customVoiceId}
                    onChange={(e) => setNewAgent({...newAgent, customVoiceId: e.target.value})}
                    className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
                    placeholder="Paste any ElevenLabs voice ID"
                  />
                )}
                {newAgent.voice === '__clone__' && (
                  <div className="mt-3 space-y-3 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                    <input
                      type="text"
                      value={voiceName}
                      onChange={(e) => setVoiceName(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
                      placeholder="Name your voice"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={isRecording ? stopRecording : startRecording} className={`flex items-center gap-2 rounded-xl px-4 py-3 font-bold ${isRecording ? 'bg-rose-600 text-white' : 'bg-white/10 text-white'}`}>
                        {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        {isRecording ? 'Stop recording' : 'Record voice'}
                      </button>
                      <label className="cursor-pointer flex items-center gap-2 rounded-xl px-4 py-3 bg-white/10 text-white font-bold">
                        <Upload className="w-4 h-4" />
                        Upload audio
                        <input type="file" accept="audio/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setVoiceSample(file);
                            setVoiceStatus(`${file.name} is ready.`);
                          }
                        }} />
                      </label>
                    </div>
                    <button type="button" onClick={cloneVoice} disabled={!voiceSample || isCloning} className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-white font-bold disabled:opacity-40">
                      {isCloning && <Loader2 className="w-4 h-4 animate-spin" />}
                      Create & select this voice
                    </button>
                    <p className="text-xs text-slate-400">{voiceStatus || 'For best results, provide at least 60 seconds of clear speech.'}</p>
                  </div>
                )}
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
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(agent.id)}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-300 transition-all"
                    title="Copy agent ID for API requests"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Agent ID: {agent.id.slice(0, 10)}…
                  </button>
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
                    className="flex-1 py-3 bg-white/5 border border-white/5 text-white rounded-xl text-sm font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Knowledge
                  </button>
                  <button
                    onClick={() => setSelectedAgentRules(agent)}
                    className="flex-1 py-3 bg-indigo-600/15 border border-indigo-500/20 text-indigo-200 rounded-xl text-sm font-bold hover:bg-indigo-600/25 transition-all flex items-center justify-center gap-2"
                  >
                    <ClipboardList className="w-4 h-4" />
                    Rules
                  </button>
                  <button 
                    onClick={() => handleDelete(agent.id)}
                    className="p-3 bg-red-400/5 text-red-400 hover:bg-red-400/10 rounded-xl transition-all border border-red-400/10"
                  >
                    <Trash2 className="w-4 h-4" />
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
          <button className="md:ml-auto px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all active:scale-95 shadow-2xl">
            Explore Documentation
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-white/10 transition-all duration-700" />
      </div>
    </div>
  );
}
