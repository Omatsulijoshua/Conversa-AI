"use client";

import { useState } from 'react';
import { 
  Send, 
  Mic, 
  Paperclip, 
  MoreVertical,
  Bot,
  User,
  Phone
} from 'lucide-react';

const initialMessages = [
  { role: 'assistant', content: 'Hello! I am your AI assistant. How can I help you today?', timestamp: '10:00 AM' },
];

export default function Chat() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content: input, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
    setMessages(newMessages);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I've received your message: "${input}". This is a demonstration of the Conversa AI platform.`, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto border-x border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
      {/* Header */}
      <header className="glass-header px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center">
            <Bot className="text-white w-7 h-7" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Conversa Assistant</h1>
            <p className="text-xs text-emerald-500 font-medium">Online • Powered by Conversa AI</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <Phone className="w-5 h-5 text-slate-500" />
          </button>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-100 dark:bg-slate-800'}`}>
              {msg.role === 'user' ? <User className="text-white w-5 h-5" /> : <Bot className="text-indigo-600 dark:text-indigo-400 w-5 h-5" />}
            </div>
            <div className="space-y-1">
              <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
              <p className={`text-[10px] text-slate-400 ${msg.role === 'user' ? 'text-right' : ''}`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </main>

      {/* Input */}
      <footer className="p-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 rounded-2xl p-2 pl-4">
          <button className="p-2 text-slate-400 hover:text-indigo-500 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..." 
            className="flex-1 bg-transparent border-none focus:outline-none py-3 text-sm"
          />
          <div className="flex items-center gap-1">
            <button className="p-3 text-slate-400 hover:text-indigo-500 transition-colors">
              <Mic className="w-5 h-5" />
            </button>
            <button 
              onClick={handleSend}
              className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 transition-all active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
