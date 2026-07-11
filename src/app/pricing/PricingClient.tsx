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

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Server responded with a status error');
      }

      // Refresh the page/layout to fetch new user_metadata, then redirect to dashboard
      router.refresh();
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      alert(`Failed to upgrade: ${err.message}`);
      setLoadingTier(null);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      
      {/* Pilot Tier */}
      <div className="bg-[#0a0a0a] rounded-3xl p-8 border border-white/5 flex flex-col relative overflow-hidden group hover:border-white/20 transition-colors">
        <h3 className="text-lg font-semibold text-white mb-2">Pilot</h3>
        <p className="text-gray-500 text-sm mb-6">Stop leaking ad spend today. We cover the setup, you only pay for the qualified meetings that hit your calendar.</p>
        <div className="mb-8 flex flex-col">
          <div>
            <span className="text-4xl font-extrabold text-white">$199</span>
            <span className="text-gray-500">/mo</span>
          </div>
          <span className="text-emerald-400 text-sm font-medium mt-1">+ $50 per Qualified Meeting</span>
        </div>
        <ul className="space-y-4 mb-8 flex-1 text-sm text-gray-300">
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Up to 500 inbound AI conversations/month.
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            &lt;30-second response time via website widget.
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Standard AI qualification playbook.
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            1 CRM / Calendar Integration.
          </li>
        </ul>
        <button 
          onClick={() => handleUpgrade('Pilot')}
          disabled={loadingTier !== null}
          className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors disabled:opacity-50"
        >
          {loadingTier === 'Pilot' ? 'Processing...' : 'Get Pilot'}
        </button>
      </div>

      {/* Growth Tier */}
      <div className="bg-[#111] rounded-3xl p-8 border border-emerald-500/30 flex flex-col relative overflow-hidden group shadow-2xl transform md:-translate-y-4">
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
        <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/20">
          Popular
        </div>
        <h3 className="text-lg font-semibold text-emerald-400 mb-2">Growth</h3>
        <p className="text-gray-400 text-sm mb-6">Our most popular plan. Lock in a lower cost-per-meeting as your inbound lead volume scales.</p>
        <div className="mb-8 flex flex-col">
          <div>
            <span className="text-4xl font-extrabold text-white">$599</span>
            <span className="text-gray-500">/mo</span>
          </div>
          <span className="text-emerald-400 text-sm font-medium mt-1">Includes 10 Qualified Meetings</span>
          <span className="text-gray-500 text-xs mt-1">Overage: $40 / meeting</span>
        </div>
        <ul className="space-y-4 mb-8 flex-1 text-sm text-gray-200">
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Everything in Pilot.
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Up to 2,500 inbound AI conversations/month.
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Multi-channel AI follow-up (Web, SMS, Email).
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Custom objections & bespoke playbooks.
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Advanced lead routing (Round-robin / territory).
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

      {/* Scale Tier */}
      <div className="bg-[#0a0a0a] rounded-3xl p-8 border border-white/5 flex flex-col relative overflow-hidden group hover:border-white/20 transition-colors">
        <h3 className="text-lg font-semibold text-white mb-2">Scale</h3>
        <p className="text-gray-500 text-sm mb-6">An autonomous inbound SDR engine designed to handle massive ad scale without breaking a sweat.</p>
        <div className="mb-8 flex flex-col">
          <div>
            <span className="text-4xl font-extrabold text-white">$1,499</span>
            <span className="text-gray-500">/mo</span>
          </div>
          <span className="text-emerald-400 text-sm font-medium mt-1">Includes 35 Qualified Meetings</span>
          <span className="text-gray-500 text-xs mt-1">Overage: $30 / meeting</span>
        </div>
        <ul className="space-y-4 mb-8 flex-1 text-sm text-gray-300">
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Everything in Growth.
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Unlimited AI conversations.
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Deep bespoke CRM integrations (Salesforce/Webhooks).
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Dedicated Slack support channel & priority onboarding.
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            A/B testing of AI opening lines.
          </li>
        </ul>
        <button 
          onClick={() => handleUpgrade('Scale')}
          disabled={loadingTier !== null}
          className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors disabled:opacity-50"
        >
          {loadingTier === 'Scale' ? 'Processing...' : 'Get Scale'}
        </button>
      </div>

    </div>
  );
}
