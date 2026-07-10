import React from 'react';
import PricingClient from './PricingClient';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <svg viewBox="0 0 100 100" className="w-8 h-8 text-emerald-500" fill="currentColor">
                <circle cx="50" cy="25" r="18" />
                <circle cx="73.8" cy="42.3" r="18" />
                <circle cx="64.7" cy="70.2" r="18" />
                <circle cx="35.3" cy="70.2" r="18" />
                <circle cx="26.2" cy="42.3" r="18" />
                <circle cx="50" cy="50" r="16" fill="currentColor" />
                <circle cx="50" cy="50" r="6" fill="#022c22" />
              </svg>
              <span className="font-bold text-xl tracking-tight text-white">Clovrr</span>
            </Link>
            <div className="flex items-center gap-6">
              {user ? (
                <Link href="/dashboard" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                  Go to Dashboard
                </Link>
              ) : (
                <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-400">
            No hidden fees. No surprise charges. Just pure ROI.
            <br className="hidden md:block"/> Select a plan below to mock an upgrade for your account.
          </p>
        </div>

        {/* Pricing Cards Component */}
        <PricingClient isLoggedIn={!!user} />

      </main>
    </div>
  );
}
