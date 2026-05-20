"use client";

import { useState, useEffect } from 'react';
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
  Code2
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
      // Note: apiRequest needs to handle FormData or we use fetch directly
      const token = localStorage.getItem('conversa_token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/knowledge/${kbId}/upload`, {
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

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAgentKb, setSelectedAgentKb] = useState<any>(null);
  const [selectedAgentRules, setSelectedAgentRules] = useState<any>(null);
  const [newAgent, setNewAgent] = useState({ name: '', type: 'Support', voice: 'Amy' });

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
      await apiRequest('/agent/create', {
        method: 'POST',
        body: JSON.stringify(newAgent)
      });
      setShowCreateModal(false);
      setNewAgent({ name: '', type: 'Support', voice: 'Amy' });
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
