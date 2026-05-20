"use client";

import { useState } from 'react';
import { Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for admin login
    console.log('Admin login attempt');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 mb-6 shadow-2xl shadow-indigo-500/40">
            <ShieldCheck className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-slate-500 font-medium">Conversa AI Infrastructure Management</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input 
                  type="email" 
                  className="w-full bg-black border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-600 transition-all"
                  placeholder="admin@conversa.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 ml-1">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input 
                  type="password" 
                  className="w-full bg-black border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-600 transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all active:scale-95 shadow-xl shadow-indigo-600/20">
              Enter Platform
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-zinc-600 text-sm">
          Protected by Conversa AI Security. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
