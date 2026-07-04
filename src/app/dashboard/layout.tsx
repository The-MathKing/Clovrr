import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { logout } from '@/app/login/actions';

import Link from 'next/link';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch client details
  const { data: client } = await supabase
    .from('clients')
    .select('name')
    .eq('email', user.email)
    .single();

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row text-gray-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col">
        <div className="h-14 flex items-center px-6 border-b border-white/5">
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
            <span className="font-bold text-lg tracking-tight text-white">Clovrr</span>
          </Link>
        </div>
        
        <div className="px-4 py-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            {client?.name || 'Agency Dashboard'}
          </p>
          <nav className="space-y-2">
            <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Overview
            </a>
            <a href="/dashboard/leads" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              Lead Manager
            </a>
            <a href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Settings
            </a>
          </nav>
        </div>
        
        <div className="mt-auto px-4 py-4 border-t border-gray-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="text-sm truncate text-gray-400">
              {user.email}
            </div>
          </div>
          <form action={logout}>
            <button type="submit" className="text-gray-500 hover:text-white transition-colors" title="Sign out">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-black">
        {children}
      </main>
    </div>
  );
}
