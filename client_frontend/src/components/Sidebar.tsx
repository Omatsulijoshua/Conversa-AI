"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Terminal,
  Key, 
  UserCircle, 
  Mic2, 
  BarChart3, 
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Terminal, label: 'Playground', href: '/playground' },
  { icon: Key, label: 'API Keys', href: '/api-keys' },
  { icon: UserCircle, label: 'AI Agents', href: '/agents' },
  { icon: Mic2, label: 'Voice Lab', href: '/voice-lab' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 h-screen border-r border-white/5 flex flex-col p-6 sticky top-0 bg-slate-950">
      <div className="flex items-center gap-3 mb-12 px-4">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Mic2 className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">Conversa <span className="text-indigo-500">AI</span></span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              pathname === item.href 
                ? 'text-white bg-indigo-600/10 border border-indigo-600/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5 space-y-2">
        <Link href="/docs" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          <HelpCircle className="w-5 h-5" />
          <span className="font-medium">Documentation</span>
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-all text-left">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
