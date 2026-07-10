'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PricingClient({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleUpgrade = async (tier: string) => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    setLoadingTier(tier);
    
    try {
      const res = await fetch('/api/user/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier })
      });

      if (!res.ok) throw new Error('Upgrade failed');

      // Refresh the page/layout to fetch new user_metadata, then redirect to dashboard
      router.refresh();
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to process upgrade mock. Please try again.');
      setLoadingTier(null);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      
      {/* Starter Tier */}
      <div className="bg-[#0a0a0a] rounded-3xl p-8 border border-white/5 flex flex-col relative overflow-hidden group hover:border-white/20 transition-colors">
        <h3 className="text-lg font-semibold text-white mb-2">Starter</h3>
        <p className="text-gray-500 text-sm mb-6">Perfect for solo agents.</p>
        <div className="mb-8">
          <span className="text-4xl font-extrabold text-white">$97</span>
          <span className="text-gray-500">/mo</span>
        </div>
        <ul className="space-y-4 mb-8 flex-1 text-sm text-gray-300">
          <li className="flex items-center gap-3">
            <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            500 AI Responses / mo
          </li>
          <li className="flex items-center gap-3">
            <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            1 CRM Integration
          </li>
          <li className="flex items-center gap-3">
            <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Basic Support
          </li>
        </ul>
        <button 
          onClick={() => handleUpgrade('Starter')}
          disabled={loadingTier !== null}
          className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors disabled:opacity-50"
        >
          {loadingTier === 'Starter' ? 'Processing...' : 'Get Starter'}
        </button>
      </div>

      {/* Growth Tier */}
      <div className="bg-[#111] rounded-3xl p-8 border border-emerald-500/30 flex flex-col relative overflow-hidden group shadow-2xl transform md:-translate-y-4">
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
        <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/20">
          Popular
        </div>
        <h3 className="text-lg font-semibold text-emerald-400 mb-2">Growth</h3>
        <p className="text-gray-400 text-sm mb-6">For growing teams and agencies.</p>
        <div className="mb-8">
          <span className="text-4xl font-extrabold text-white">$297</span>
          <span className="text-gray-500">/mo</span>
        </div>
        <ul className="space-y-4 mb-8 flex-1 text-sm text-gray-200">
          <li className="flex items-center gap-3">
            <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Unlimited AI Responses
          </li>
          <li className="flex items-center gap-3">
            <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Unlimited CRM Integrations
          </li>
          <li className="flex items-center gap-3">
            <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Advanced Custom Personas
          </li>
          <li className="flex items-center gap-3">
            <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Priority Support
          </li>
        </ul>
        <button 
          onClick={() => handleUpgrade('Growth')}
          disabled={loadingTier !== null}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          {loadingTier === 'Growth' ? 'Processing...' : 'Get Growth'}
        </button>
      </div>

      {/* Enterprise Tier */}
      <div className="bg-[#0a0a0a] rounded-3xl p-8 border border-white/5 flex flex-col relative overflow-hidden group hover:border-white/20 transition-colors">
        <h3 className="text-lg font-semibold text-white mb-2">Enterprise</h3>
        <p className="text-gray-500 text-sm mb-6">Custom workflows at scale.</p>
        <div className="mb-8">
          <span className="text-4xl font-extrabold text-white">Custom</span>
        </div>
        <ul className="space-y-4 mb-8 flex-1 text-sm text-gray-300">
          <li className="flex items-center gap-3">
            <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Dedicated Account Manager
          </li>
          <li className="flex items-center gap-3">
            <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Custom Model Fine-tuning
          </li>
          <li className="flex items-center gap-3">
            <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            White-label Dashboard
          </li>
          <li className="flex items-center gap-3">
            <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            SLA Guarantees
          </li>
        </ul>
        <button 
          onClick={() => handleUpgrade('Enterprise')}
          disabled={loadingTier !== null}
          className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors disabled:opacity-50"
        >
          {loadingTier === 'Enterprise' ? 'Processing...' : 'Contact Sales'}
        </button>
      </div>

    </div>
  );
}
