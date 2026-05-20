"use client";

import { useState } from 'react';
import { 
  Book, 
  Code, 
  Copy, 
  Check,
  ChevronRight,
  Zap,
  Terminal as TerminalIcon
} from 'lucide-react';

const languages = [
  { id: 'js', name: 'JavaScript (Node.js)', icon: 'JS' },
  { id: 'python', name: 'Python', icon: 'PY' },
  { id: 'csharp', name: 'C# (HttpClient)', icon: 'C#' },
];

const codeSamples: any = {
  js: `const axios = require('axios');

const startConversation = async (agentId) => {
  const response = await axios.post('https://api.conversa.ai/v1/conversation/start', 
    { agentId },
    { headers: { 'x-api-key': 'YOUR_API_KEY' } }
  );
  return response.data.sessionId;
};`,
  python: `import requests

def start_conversation(agent_id):
    url = "https://api.conversa.ai/v1/conversation/start"
    headers = {"x-api-key": "YOUR_API_KEY"}
    payload = {"agentId": agent_id}
    
    response = requests.post(url, json=payload, headers=headers)
    return response.json()["sessionId"]`,
  csharp: `using System.Net.Http;
using System.Text;
using Newtonsoft.Json;

public async Task<string> StartConversation(string agentId) {
    var client = new HttpClient();
    client.DefaultRequestHeaders.Add("x-api-key", "YOUR_API_KEY");
    
    var content = new StringContent(
        JsonConvert.SerializeObject(new { agentId }), 
        Encoding.UTF8, 
        "application/json"
    );
    
    var response = await client.PostAsync("https://api.conversa.ai/v1/conversation/start", content);
    var result = await response.Content.ReadAsStringAsync();
    return JsonConvert.DeserializeObject<dynamic>(result).sessionId;
}`,
};

export default function Docs() {
  const [selectedLang, setSelectedLang] = useState('js');
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(codeSamples[selectedLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <header className="mb-12">
        <div className="flex items-center gap-3 text-indigo-400 mb-4">
          <Book className="w-6 h-6" />
          <span className="font-bold uppercase tracking-widest text-xs">Developer Documentation</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Getting Started</h1>
        <p className="text-xl text-gray-400">Integrate intelligent voice and chat AI into your applications in minutes.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Quick Start */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Zap className="w-5 h-5 text-indigo-400" />
              </div>
              Quick Start
            </h2>
            <div className="space-y-6">
              {[
                { step: 1, title: 'Generate API Key', desc: 'Create a secret key in the API Keys section of your dashboard.' },
                { step: 2, title: 'Configure Agent', desc: 'Define your agent\'s personality, tone, and industry instructions.' },
                { step: 3, title: 'Start Integrating', desc: 'Use our SDKs or REST APIs to connect your app to Conversa AI.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 font-bold text-indigo-400">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">{item.title}</h4>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Code Samples */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Code className="w-5 h-5 text-purple-400" />
              </div>
              Code Samples
            </h2>
            
            <div className="glass-card overflow-hidden">
              <div className="bg-white/[0.03] border-b border-white/5 p-2 flex gap-1">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLang(lang.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${selectedLang === lang.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                  >
                    {lang.name}
                  </button>
                ))}
                <button 
                  onClick={copyCode}
                  className="ml-auto p-2 text-gray-500 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="p-6 bg-black/40 overflow-x-auto">
                <pre className="font-mono text-sm text-indigo-100 leading-relaxed">
                  {codeSamples[selectedLang]}
                </pre>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar: Resources */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4">Resources</h3>
            <ul className="space-y-3">
              {[
                'API Reference',
                'SDK Documentation',
                'Webhooks Guide',
                'Rate Limits',
                'Security Policy',
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center justify-between group text-sm text-gray-400 hover:text-white transition-colors">
                    {item}
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-6 bg-indigo-600/5 border-indigo-500/20">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <TerminalIcon className="w-4 h-4 text-indigo-400" />
              Need Help?
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Our developer support team is available 24/7 to help you with your integration.
            </p>
            <button className="w-full py-2 bg-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-500 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
