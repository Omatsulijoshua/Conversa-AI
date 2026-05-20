"use client";

import { useState } from 'react';
import { 
  Key, 
  Copy, 
  RefreshCw, 
  Trash2, 
  ShieldCheck,
  Plus
} from 'lucide-react';

const initialKeys = [
  { id: '1', name: 'Production Key', key: 'cv_7k2n9m1p8l0...', lastUsed: '2 mins ago', created: 'Oct 12, 2023' },
  { id: '2', name: 'Staging Environment', key: 'cv_4x8b2v9q1w3...', lastUsed: '1 day ago', created: 'Nov 05, 2023' },
];

export default function ApiKeys() {
  const [keys, setKeys] = useState(initialKeys);

  return (
    <div className="animate-fade-in">
      <header className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">API Keys</h1>
          <p className="text-gray-400">Manage your secret keys to access Conversa AI APIs.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Generate New Key
        </button>
      </header>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Secret Key</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Used</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {keys.map((key) => (
              <tr key={key.id} className="hover:bg-white/[0.01] transition-colors">
                <td className="px-6 py-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                      <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    </div>
                    <span className="font-medium">{key.name}</span>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2 font-mono text-sm text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 w-fit">
                    {key.key}
                    <button className="hover:text-white transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-6 text-sm text-gray-400">
                  {key.lastUsed}
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-rose-500/10 rounded-lg transition-colors text-gray-400 hover:text-rose-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-6 glass-card border-indigo-500/20 bg-indigo-500/5">
        <div className="flex gap-4">
          <div className="p-3 bg-indigo-500/20 rounded-2xl h-fit">
            <Key className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h4 className="font-bold text-lg mb-1">Security Best Practices</h4>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
              Never share your API keys in public repositories or client-side code. Use environment variables and rotate your keys regularly to ensure the security of your Conversa AI integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
