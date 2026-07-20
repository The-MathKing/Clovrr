import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch client details to check admin status
  const { data: client } = await supabase
    .from('clients')
    .select('is_admin')
    .eq('email', user.email)
    .single();

  if (!client?.is_admin) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-black flex flex-col text-gray-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <header className="h-14 flex items-center px-6 border-b border-white/5 bg-[#0a0a0a] justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <svg viewBox="0 0 100 100" className="w-6 h-6 text-emerald-500" fill="currentColor">
              <circle cx="50" cy="25" r="18" />
              <circle cx="73.8" cy="42.3" r="18" />
              <circle cx="64.7" cy="70.2" r="18" />
              <circle cx="35.3" cy="70.2" r="18" />
              <circle cx="26.2" cy="42.3" r="18" />
              <circle cx="50" cy="50" r="16" fill="currentColor" />
              <circle cx="50" cy="50" r="6" fill="#022c22" />
            </svg>
            <span className="font-bold text-lg tracking-tight text-white">Clovrr Admin</span>
          </Link>
        </div>
        <Link href="/dashboard" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
          Exit to Dashboard
        </Link>
      </header>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
