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

const AgentStudioModal = ({ agent, onClose, onSaved }: { agent: any, onClose: () => void, onSaved: () => void }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'voice' | 'knowledge' | 'actions' | 'extraction' | 'connect'>('general');
  const [name, setName] = useState(agent.name || '');
  const [tone, setTone] = useState(agent.tone || 'Warm, patient, clear, and natural.');
  const [industry, setIndustry] = useState(agent.industry || 'Support');
  const [instructions, setInstructions] = useState(agent.instructions || '');
  const [voiceId, setVoiceId] = useState(agent.voiceId || 'Amy');

  // Settings states
  const initialSettings = agent.settings || {};
  const [model, setModel] = useState(initialSettings.model || 'gemini-1.5-flash');
  const [temperature, setTemperature] = useState(initialSettings.temperature !== undefined ? initialSettings.temperature : 0.4);
  const [voiceStability, setVoiceStability] = useState(initialSettings.voiceStability !== undefined ? initialSettings.voiceStability : 75);
  const [voiceSimilarity, setVoiceSimilarity] = useState(initialSettings.voiceSimilarity !== undefined ? initialSettings.voiceSimilarity : 75);
  const [voiceSpeed, setVoiceSpeed] = useState(initialSettings.voiceSpeed !== undefined ? initialSettings.voiceSpeed : 100);
  const [greeting, setGreeting] = useState(initialSettings.greeting || 'Hi, thanks for calling. How can I help you today?');
  const [speakFirst, setSpeakFirst] = useState(initialSettings.speakFirst !== undefined ? initialSettings.speakFirst : true);

  // Tools & Extractions states
  const [tools, setTools] = useState<any[]>(initialSettings.tools || []);
  const [newTool, setNewTool] = useState({ name: '', description: '', url: '' });
  const [extractions, setExtractions] = useState<any[]>(initialSettings.extractions || []);
  const [newExtraction, setNewExtraction] = useState({ key: '', description: '', type: 'string' });

  // Knowledge base state integration
  const [kbBases, setKbBases] = useState<any[]>([]);
  const [kbLoading, setKbLoading] = useState(true);
  const [kbUploading, setKbUploading] = useState(false);
  const [newKbName, setNewKbName] = useState('');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeConnectTab, setActiveConnectTab] = useState('webrtc');

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
      setKbLoading(false);
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
    setKbUploading(true);
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
      setKbUploading(false);
    }
  };

  const handleAddTool = () => {
    if (!newTool.name || !newTool.url) return;
    setTools([...tools, newTool]);
    setNewTool({ name: '', description: '', url: '' });
  };

  const handleRemoveTool = (index: number) => {
    setTools(tools.filter((_, i) => i !== index));
  };

  const handleAddExtraction = () => {
    if (!newExtraction.key) return;
    setExtractions([...extractions, newExtraction]);
    setNewExtraction({ key: '', description: '', type: 'string' });
  };

  const handleRemoveExtraction = (index: number) => {
    setExtractions(extractions.filter((_, i) => i !== index));
  };

  const saveSettings = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await apiRequest(`/agent/${agent.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name,
          tone,
          industry,
          instructions,
          voiceId,
          settings: {
            model,
            temperature,
            voiceStability,
            voiceSimilarity,
            voiceSpeed,
            greeting,
            speakFirst,
            tools,
            extractions
          }
        })
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      onSaved();
    } catch (err) {
      alert('Failed to save agent settings');
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const webhookUrl = `https://conversa-backend-6bou.onrender.com/api/v1/voice/telephony/inbound/${agent.tenantId}/${agent.id}`;

  const tabs = [
    { id: 'general', label: '🧠 Brain & Model' },
    { id: 'voice', label: '🎙️ Vocal settings' },
    { id: 'knowledge', label: '📚 Knowledge Base' },
    { id: 'actions', label: '🛠️ Custom Actions' },
    { id: 'extraction', label: '🔍 Extractions' },
    { id: 'connect', label: '🔌 Connect' }
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="glass-card w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-[3rem] border border-white/10 bg-slate-950 flex flex-col shadow-2xl relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center relative z-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl">
              <BrainCircuit className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{name || 'Agent'} Agent Studio</h3>
              <p className="text-slate-400 text-sm">Configure conversation flows, models, voices, RAG knowledge, and webhooks</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Studio Sub-Navigation */}
        <div className="px-8 py-3 bg-slate-900/60 border-b border-white/5 flex gap-2 overflow-x-auto scrollbar-hide relative z-10 flex-shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Studio Main Workspace */}
        <div className="flex-1 overflow-y-auto p-8 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active Configuration Pane */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* GENERAL TAB */}
            {activeTab === 'general' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Agent Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Industry Type</label>
                    <input 
                      type="text" 
                      value={industry} 
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Conversation Tone</label>
                    <input 
                      type="text" 
                      value={tone} 
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">LLM Model Override</label>
                    <select 
                      value={model} 
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-indigo-500 text-sm"
                    >
                      <option value="gemini-1.5-flash">Gemini 1.5 Flash (Default - Ultra Fast)</option>
                      <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Reasoner)</option>
                      <option value="gpt-4o-mini">GPT-4o Mini (Cost-efficient)</option>
                      <option value="gpt-4o">GPT-4o (Premium Performance)</option>
                      <option value="claude-3-5-haiku-latest">Claude 3.5 Haiku</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2 flex justify-between">
                      <span>LLM Creativity (Temperature)</span>
                      <span className="text-indigo-400">{temperature}</span>
                    </label>
                    <input 
                      type="range" 
                      min="0.0" 
                      max="1.0" 
                      step="0.05"
                      value={temperature} 
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-3"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>Strict / Consistent</span>
                      <span>Creative / Random</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">System Instructions / Roleplay Prompt</label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    rows={8}
                    placeholder="Enter instructions on how the agent should handle calls, handle refund rules, or escalate..."
                    className="w-full font-mono text-xs bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-indigo-500 leading-relaxed resize-none"
                  />
                </div>
              </div>
            )}

            {/* VOICE TAB */}
            {activeTab === 'voice' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Primary Voice Preset</label>
                    <select 
                      value={voiceId} 
                      onChange={(e) => setVoiceId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-indigo-500 text-sm"
                    >
                      <option value="Amy">Amy (Warm & Professional Female)</option>
                      <option value="Marcus">Marcus (Deep & Articulate Male)</option>
                      <option value="Sophia">Sophia (Energetic Customer Rep)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Or enter Custom ElevenLabs Voice ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 21m00Tcm4TlvDq8ikWAM"
                      value={voiceId !== 'Amy' && voiceId !== 'Marcus' && voiceId !== 'Sophia' ? voiceId : ''}
                      onChange={(e) => setVoiceId(e.target.value || 'Amy')}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Initial Greeting Message</label>
                  <textarea
                    value={greeting}
                    onChange={(e) => setGreeting(e.target.value)}
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-indigo-500 text-sm leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-white/2 border border-white/5 rounded-2xl">
                  <div>
                    <p className="text-sm font-bold text-white">Agent Speaks First</p>
                    <p className="text-xs text-slate-500">If enabled, the agent initiates the call with the greeting message. Otherwise, it waits for the caller to speak.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={speakFirst}
                      onChange={(e) => setSpeakFirst(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white"></div>
                  </label>
                </div>

                <div className="space-y-5 border-t border-white/5 pt-6">
                  <h4 className="text-sm font-bold text-white">ElevenLabs Voice Tuning Sliders</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1 flex justify-between">
                        <span>Stability</span>
                        <span className="text-indigo-400">{voiceStability}%</span>
                      </label>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={voiceStability} 
                        onChange={(e) => setVoiceStability(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1 flex justify-between">
                        <span>Clarity / Similarity</span>
                        <span className="text-indigo-400">{voiceSimilarity}%</span>
                      </label>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={voiceSimilarity} 
                        onChange={(e) => setVoiceSimilarity(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1 flex justify-between">
                        <span>Voice Speed</span>
                        <span className="text-indigo-400">{voiceSpeed}%</span>
                      </label>
                      <input 
                        type="range" 
                        min="50" 
                        max="150" 
                        value={voiceSpeed} 
                        onChange={(e) => setVoiceSpeed(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* KNOWLEDGE TAB */}
            {activeTab === 'knowledge' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="e.g. Return Policy, Company FAQ" 
                    value={newKbName}
                    onChange={(e) => setNewKbName(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-indigo-500 text-sm"
                  />
                  <button 
                    onClick={handleCreateBase}
                    className="px-6 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Base
                  </button>
                </div>

                <div className="grid gap-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                  {kbLoading ? (
                    <div className="py-12 flex justify-center">
                      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    </div>
                  ) : kbBases.length > 0 ? (
                    kbBases.map((kb) => (
                      <div key={kb.id} className="p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-slate-800 rounded-xl">
                              <FileText className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                              <p className="text-white font-bold text-sm">{kb.name}</p>
                              <p className="text-[11px] text-slate-500">{kb._count.chunks} Knowledge Chunks Indexed</p>
                            </div>
                          </div>
                          <label className="cursor-pointer">
                            <input 
                              type="file" 
                              className="hidden" 
                              onChange={(e) => handleFileUpload(kb.id, e)}
                              disabled={kbUploading}
                            />
                            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 text-indigo-400 rounded-xl text-xs font-bold hover:bg-indigo-600/20 transition-all">
                              {kbUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                              Upload Text/PDF
                            </div>
                          </label>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-slate-500 bg-white/2 rounded-2xl border border-dashed border-white/10 text-sm">
                      No custom knowledge bases found. Add a base to ingest documentation.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ACTIONS TAB */}
            {activeTab === 'actions' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-xs text-indigo-200">
                  ⚡ <strong>Dynamic Webhook Tools:</strong> Define custom functions the agent can trigger during phone conversation loops. The LLM will autonomously choose when to trigger these endpoints based on user queries.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white/2 p-4 border border-white/5 rounded-2xl">
                  <input 
                    type="text" 
                    placeholder="Tool Name (e.g. check_order)" 
                    value={newTool.name}
                    onChange={(e) => setNewTool({...newTool, name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')})}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500 text-xs font-mono"
                  />
                  <input 
                    type="text" 
                    placeholder="Description (e.g. check Shopify status)" 
                    value={newTool.description}
                    onChange={(e) => setNewTool({...newTool, description: e.target.value})}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500 text-xs"
                  />
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Webhook API Endpoint URL" 
                      value={newTool.url}
                      onChange={(e) => setNewTool({...newTool, url: e.target.value})}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500 text-xs"
                    />
                    <button 
                      onClick={handleAddTool}
                      className="px-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-white text-xs"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {tools.length > 0 ? (
                    tools.map((t, idx) => (
                      <div key={idx} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all font-mono text-xs">
                        <div className="space-y-1">
                          <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-bold">{t.name}</span>
                          <p className="text-[10px] text-slate-400 font-sans mt-1">{t.description}</p>
                          <p className="text-[10px] text-slate-500 font-mono break-all">{t.url}</p>
                        </div>
                        <button 
                          onClick={() => handleRemoveTool(idx)}
                          className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-white/10 rounded-2xl">
                      No webhook tools registered yet. Build integrations above.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* EXTRACTION TAB */}
            {activeTab === 'extraction' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-xs text-indigo-200">
                  📊 <strong>Post-Call Variables:</strong> Define structured data points the AI should automatically extract from call transcripts once a session concludes (saved to database call analytics logs).
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white/2 p-4 border border-white/5 rounded-2xl">
                  <input 
                    type="text" 
                    placeholder="Variable Key (e.g. user_email)" 
                    value={newExtraction.key}
                    onChange={(e) => setNewExtraction({...newExtraction, key: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')})}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500 text-xs font-mono"
                  />
                  <input 
                    type="text" 
                    placeholder="Instructions (e.g. extract user's email)" 
                    value={newExtraction.description}
                    onChange={(e) => setNewExtraction({...newExtraction, description: e.target.value})}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500 text-xs"
                  />
                  <div className="flex gap-2">
                    <select
                      value={newExtraction.type}
                      onChange={(e) => setNewExtraction({...newExtraction, type: e.target.value})}
                      className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500 text-xs"
                    >
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean</option>
                    </select>
                    <button 
                      onClick={handleAddExtraction}
                      className="px-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-white text-xs flex-shrink-0"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {extractions.length > 0 ? (
                    extractions.map((e, idx) => (
                      <div key={idx} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all font-mono text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">{e.key}</span>
                            <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">({e.type})</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-sans mt-1">{e.description}</p>
                        </div>
                        <button 
                          onClick={() => handleRemoveExtraction(idx)}
                          className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-white/10 rounded-2xl">
                      No variable extractions defined. Define variables above to populate analytics schemas.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TELEPHONY CONNECT TAB */}
            {activeTab === 'connect' && (
              <div className="space-y-6 animate-fade-in max-h-[50vh] overflow-y-auto pr-2 scrollbar-hide">
                <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit flex-wrap">
                  {['webrtc', 'twilio', 'telnyx', 'sip', 'gsm'].map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setActiveConnectTab(ch)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeConnectTab === ch ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      {ch.toUpperCase()}
                    </button>
                  ))}
                </div>

                {activeConnectTab === 'webrtc' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Globe className="w-4 h-4 text-indigo-400" />
                      WebRTC In-App Calling Client Script
                    </h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Embed conversational audio stream straight to your custom dashboard.
                    </p>
                    <pre className="p-4 bg-black/60 border border-white/10 rounded-xl font-mono text-[10px] text-indigo-300 overflow-x-auto whitespace-pre-wrap">
{`import { ConversaRTC } from '@conversa/rtc-client';
const call = new ConversaRTC({
  backendUrl: 'https://conversa-backend-6bou.onrender.com',
  agentId: '${agent.id}'
});
call.start();`}
                    </pre>
                  </div>
                )}

                {activeConnectTab === 'twilio' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white">Twilio Voice URL Webhook</h4>
                    <p className="text-slate-400 text-xs">Set as webhook POST under Incoming Call configuration in Twilio Console:</p>
                    <div className="flex gap-2 items-center bg-black/60 border border-white/10 rounded-xl p-3">
                      <span className="font-mono text-[10px] text-indigo-300 break-all select-all flex-1">{webhookUrl}</span>
                      <button 
                        onClick={() => copyToClipboard(webhookUrl)}
                        className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-all flex-shrink-0"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                {activeConnectTab === 'telnyx' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white">Telnyx TeXML Webhook Application</h4>
                    <p className="text-slate-400 text-xs">Configure TeXML Application URL in Telnyx dashboard to point to:</p>
                    <div className="flex gap-2 items-center bg-black/60 border border-white/10 rounded-xl p-3">
                      <span className="font-mono text-[10px] text-indigo-300 break-all select-all flex-1">{webhookUrl}</span>
                      <button 
                        onClick={() => copyToClipboard(webhookUrl)}
                        className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-all flex-shrink-0"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                {activeConnectTab === 'sip' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white">Conversa Hosted SIP Proxy Credentials</h4>
                    <div className="grid grid-cols-2 gap-3 text-[10px] font-mono text-slate-300 bg-white/2 p-4 rounded-xl">
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase font-sans mb-0.5">SIP Registrar</span>
                        <span className="text-indigo-300">sip.conversa-ai.com</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase font-sans mb-0.5">SIP Port</span>
                        <span className="text-indigo-300">5060 (UDP)</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase font-sans mb-0.5">SIP Username</span>
                        <span className="text-indigo-300">conversa_usr_{agent.id.slice(0, 8)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase font-sans mb-0.5">SIP Password</span>
                        <span className="text-indigo-300">conversa_pass_{agent.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeConnectTab === 'gsm' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white">Local GSM Android Gateway Setup</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Download Linphone or Sim2Sip onto your Android phone. Register to `sip.conversa-ai.com` with username `conversa_usr_{agent.id.slice(0, 8)}`. Enable call forwarding from your SIM.
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Studio Dashboard Preview Diagram */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 space-y-6 sticky top-0">
              <h4 className="text-sm font-bold text-white border-b border-white/5 pb-3">Agent Call Flow Diagram</h4>
              
              <div className="space-y-4 font-mono text-[10px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold font-sans">1</span>
                  <div>
                    <span className="text-white block font-bold">Caller Inbound Dial</span>
                    <span className="text-slate-500 text-[9px]">Telephony routes to Conversa proxy</span>
                  </div>
                </div>

                <div className="h-6 w-0.5 bg-slate-800 ml-2.5" />

                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold font-sans">2</span>
                  <div>
                    <span className="text-white block font-bold">Greeting Stream ({speakFirst ? 'Active' : 'Muted'})</span>
                    <span className="text-indigo-400 text-[9px] truncate block max-w-[200px]">"{greeting}"</span>
                  </div>
                </div>

                <div className="h-6 w-0.5 bg-slate-800 ml-2.5" />

                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold font-sans">3</span>
                  <div>
                    <span className="text-white block font-bold">Speech processing (STT & TTS)</span>
                    <span className="text-slate-500 text-[9px]">Voice ID: {voiceId}</span>
                  </div>
                </div>

                <div className="h-6 w-0.5 bg-slate-800 ml-2.5" />

                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold font-sans">4</span>
                  <div>
                    <span className="text-white block font-bold">Cognitive LLM Engine</span>
                    <span className="text-amber-400 text-[9px]">{model.toUpperCase()} @ temp: {temperature}</span>
                  </div>
                </div>

                {tools.length > 0 && (
                  <>
                    <div className="h-6 w-0.5 bg-slate-800 ml-2.5" />
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold font-sans">5</span>
                      <div>
                        <span className="text-white block font-bold">Active Functions ({tools.length} Tools)</span>
                        <div className="flex gap-1 flex-wrap mt-1">
                          {tools.map(t => (
                            <span key={t.name} className="bg-cyan-500/10 text-cyan-300 px-1 py-0.2 rounded text-[8px]">{t.name}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {extractions.length > 0 && (
                  <>
                    <div className="h-6 w-0.5 bg-slate-800 ml-2.5" />
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-pink-600/20 text-pink-400 flex items-center justify-center font-bold font-sans">6</span>
                      <div>
                        <span className="text-white block font-bold">Post-Call Extractions</span>
                        <div className="flex gap-1 flex-wrap mt-1">
                          {extractions.map(e => (
                            <span key={e.key} className="bg-pink-500/10 text-pink-300 px-1 py-0.2 rounded text-[8px]">{e.key}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 bg-slate-900/40 flex-shrink-0">
          <p className="text-xs text-slate-500">
            Clicking save uploads settings to the Conversa API server and deploys changes to live voice nodes instantly.
          </p>
          <div className="flex items-center gap-4">
            {saved && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold animate-pulse">
                <Check className="w-4 h-4" /> Config Saved
              </span>
            )}
            <button
              onClick={saveSettings}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Studio Config
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

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
        <AgentStudioModal
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
                    <Settings2 className="w-3.5 h-3.5" />
                    Studio
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
