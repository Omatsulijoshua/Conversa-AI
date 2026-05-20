"use client";

import { useState } from 'react';
import { 
  Send, 
  Terminal, 
  Code2, 
  Globe, 
  Shield,
  PlayCircle,
  Copy,
  Check
} from 'lucide-react';

const endpoints = [
  { method: 'POST', path: '/conversation/start', description: 'Initialize a new chat session' },
  { method: 'POST', path: '/conversation/message', description: 'Send a message to an agent' },
  { method: 'POST', path: '/speech/tts', description: 'Convert text to speech' },
  { method: 'POST', path: '/speech/stt', description: 'Transcribe audio to text' },
  { method: 'GET', path: '/analytics/usage', description: 'Fetch usage metrics' },
];

export default function Playground() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0]);
  const [requestBody, setRequestBody] = useState('{\n  "agentId": "agent_123"\n}');
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRun = async () => {
    setIsLoading(true);
    setResponse(null);
    
    // Simulate API call
    setTimeout(() => {
      setResponse({
        status: 200,
        data: {
          sessionId: "sess_9x2b8v4m",
          agent: "Support Bot",
          message: "Session successfully initialized.",
          timestamp: new Date().toISOString()
        }
      });
      setIsLoading(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(requestBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">API Playground</h1>
        <p className="text-gray-400">Test your integration in real-time with our interactive sandbox.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Sidebar: Endpoints */}
        <div className="xl:col-span-4 space-y-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest px-2">Endpoints</h3>
          <div className="space-y-2">
            {endpoints.map((ep, i) => (
              <button
                key={i}
                onClick={() => setSelectedEndpoint(ep)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedEndpoint.path === ep.path ? 'bg-indigo-600/10 border-indigo-500/30 ring-1 ring-indigo-500/20' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${ep.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {ep.method}
                  </span>
                  <code className="text-sm font-mono text-indigo-300">{ep.path}</code>
                </div>
                <p className="text-xs text-gray-500">{ep.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Main: Request/Response */}
        <div className="xl:col-span-8 space-y-6">
          <div className="glass-card overflow-hidden flex flex-col h-full">
            {/* Toolbar */}
            <div className="bg-white/[0.03] border-b border-white/5 p-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                  <Globe className="w-3 h-3" />
                  https://api.conversa.ai/v1
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                  <Shield className="w-3 h-3" />
                  Auth Verified
                </div>
              </div>
              <button 
                onClick={handleRun}
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
                Run Request
              </button>
            </div>

            {/* Request Body Editor */}
            <div className="p-6 bg-black/20 flex-1 min-h-[250px] relative">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  JSON Body
                </span>
                <button 
                  onClick={copyToClipboard}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="w-full h-full bg-transparent font-mono text-sm text-indigo-100 focus:outline-none resize-none"
                spellCheck="false"
              />
            </div>

            {/* Response Viewer */}
            <div className="border-t border-white/5 bg-black/40 p-6 min-h-[300px]">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 block flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Response
              </span>
              
              {response ? (
                <div className="animate-fade-in">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">
                      {response.status} OK
                    </span>
                    <span className="text-xs text-gray-500 font-mono">142ms</span>
                  </div>
                  <pre className="text-sm font-mono text-gray-300 overflow-x-auto">
                    {JSON.stringify(response.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-20 py-12">
                  <PlayCircle className="w-16 h-16 mb-4" />
                  <p className="font-bold">Click "Run Request" to see output</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper icons not imported
function RefreshCw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
