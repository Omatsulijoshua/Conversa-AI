"use client";

import { useEffect } from 'react';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('conversa_token', token);
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      <p className="text-slate-400 font-medium">Authenticating you...</p>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<AuthLoading />}>
      <AuthCallbackContent />
    </Suspense>
  );
}

function AuthLoading() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      <p className="text-slate-400 font-medium">Authenticating you...</p>
    </div>
  );
}
