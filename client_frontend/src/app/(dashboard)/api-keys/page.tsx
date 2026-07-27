"use client";

import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';
import { Key, Copy, Trash2, Plus, Shield, Globe, Clock, Check, AlertTriangle, Terminal, BookOpen } from 'lucide-react';

export default function ApiKeysPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [createdKey, setCreatedKey] = useState<any>(null);

  useEffect(() => {
    loadKeys();
  }, []);

  async function loadKeys() {
    try {
      const data = await apiRequest('/api-keys');
      setKeys(data);
    } catch (err) {
      console.error('Failed to load keys:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = async () => {
    if (!newKeyName) return;
    try {
      const created = await apiRequest('/api-keys', {
        method: 'POST',
        body: JSON.stringify({ name: newKeyName })
      });
      setCreatedKey(created);
      setNewKeyName('');
      setShowCreate(false);
      loadKeys();
    } catch (err) {
      alert('Failed to create key');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key?')) return;
    try {
      await apiRequest(`/api-keys/${id}`, { method: 'DELETE' });
      loadKeys();
    } catch (err) {
      alert('Failed to delete key');
    }
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
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
          <h1 className="text-4xl font-bold text-white">API <span className="text-indigo-500">Keys</span></h1>
          <p className="text-slate-400 text-lg">Manage your secure access credentials</p>
        </div>
        <button 
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Create New Key
        </button>
      </div>

      {showCreate && (
        <div className="glass-card p-6 rounded-3xl border border-indigo-500/30 bg-indigo-600/5 animate-slide-up">
          <h3 className="text-white font-bold mb-4">Create New API Key</h3>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="e.g. Production Main" 
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
            <button 
              onClick={handleCreate}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all"
            >
              Generate
            </button>
          </div>
        </div>
      )}

      {createdKey && (
        <div className="glass-card p-7 rounded-3xl border border-emerald-500/30 bg-emerald-500/10">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-300 shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">Copy this secret key now</h3>
              <p className="text-sm text-slate-300 mt-1">For your security, the complete key is shown only once. Store it in a server-side secret manager or environment variable.</p>
              <div className="mt-4 relative">
                <input readOnly value={createdKey.key} className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-4 pr-14 text-emerald-200 font-mono text-sm" />
                <button onClick={() => copyToClipboard(createdKey.key)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 hover:bg-white/10 rounded-lg" aria-label="Copy secret key">
                  {copied === createdKey.key ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-white" />}
                </button>
              </div>
              <button onClick={() => setCreatedKey(null)} className="mt-4 text-sm font-bold text-emerald-300 hover:text-white">I have stored this key securely</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-3xl flex items-start gap-4">
        <div className="p-3 bg-indigo-600 rounded-2xl">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Security Recommendation</h3>
          <p className="text-slate-400 max-w-2xl text-sm leading-relaxed">
            API keys carry full access to your account resources. Never share them in public repositories or client-side code. Use environment variables to keep them secret.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {keys.length > 0 ? (
          keys.map((item) => (
            <div key={item.id} className="glass-card p-8 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/5">
                    <Key className="w-7 h-7 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Created {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        Server API access
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 max-w-md">
                  <div className="relative group/key">
                    <input 
                      type="text" 
                      readOnly 
                      value={item.keyPreview || 'cv_••••••••••••'} 
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-slate-300 font-mono text-sm focus:outline-none focus:border-indigo-500"
                    />
                    <button 
                      disabled
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg opacity-40 cursor-not-allowed"
                    >
                      <Shield className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-emerald-400/10 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">
                    Active
                  </span>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-3 bg-red-400/5 text-red-400 hover:bg-red-400/10 rounded-xl transition-all border border-red-400/10"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-slate-500 glass-card rounded-3xl border border-white/5 bg-white/2">
            No API keys found. Create one to get started.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="glass-card p-7 rounded-3xl border border-white/10 bg-white/5">
          <div className="flex items-center gap-3 mb-5"><Terminal className="w-6 h-6 text-indigo-300" /><h2 className="text-xl font-bold text-white">Developer quick start</h2></div>
          <ol className="space-y-3 text-sm text-slate-300 mb-5">
            <li><strong className="text-white">1.</strong> Generate a key and save it as <code className="text-indigo-300">CONVERSA_API_KEY</code> on your server.</li>
            <li><strong className="text-white">2.</strong> Copy the trained agent ID from the Agents page.</li>
            <li><strong className="text-white">3.</strong> Start a session, then send customer messages using its session ID.</li>
          </ol>
          <pre className="overflow-x-auto rounded-2xl bg-black/50 border border-white/10 p-5 text-xs text-slate-300 leading-relaxed"><code>{`curl -X POST "$CONVERSA_API_URL/conversation/start" \\
  -H "x-api-key: $CONVERSA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"agentId":"YOUR_AGENT_ID"}'`}</code></pre>
        </div>
        <div className="glass-card p-7 rounded-3xl border border-white/10 bg-white/5">
          <div className="flex items-center gap-3 mb-5"><BookOpen className="w-6 h-6 text-cyan-300" /><h2 className="text-xl font-bold text-white">Use the API safely</h2></div>
          <ul className="space-y-3 text-sm text-slate-300">
            <li>Keep keys on your backend—never in browser or mobile application code.</li>
            <li>Use separate keys for development, staging, and production.</li>
            <li>Revoke a key immediately if it appears in logs, screenshots, or source control.</li>
            <li>Pass credentials in the <code className="text-cyan-300">x-api-key</code> header over HTTPS.</li>
            <li>Review “last used” dates and remove unused credentials.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
