'use client';

import React, { useState } from 'react';

export default function ROICalculator() {
  const [leads, setLeads] = useState<number>(100);
  const [ltv, setLtv] = useState<number>(5000);

  // Industry average vs Clovrr average close rates based on speed to lead
  const OLD_CLOSE_RATE = 0.05; // 5%
  const CLOVRR_CLOSE_RATE = 0.18; // 18%

  const oldRevenue = leads * OLD_CLOSE_RATE * ltv;
  const clovrrRevenue = leads * CLOVRR_CLOSE_RATE * ltv;
  const netGain = clovrrRevenue - oldRevenue;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">Calculate Your Instant-Response ROI</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Speed to lead is the highest correlating factor to closing a deal. See exactly how much revenue you're losing by responding manually.
        </p>
      </div>

      <div className="bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-2xl p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Sliders Area */}
          <div className="space-y-10 flex flex-col justify-center">
            
            {/* Leads Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-sm font-medium text-gray-300">Monthly Leads Volume</label>
                <span className="text-xl font-bold text-emerald-400">{leads.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="500" 
                step="10" 
                value={leads} 
                onChange={(e) => setLeads(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>10</span>
                <span>500+</span>
              </div>
            </div>

            {/* LTV Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-sm font-medium text-gray-300">Avg. Deal Size (LTV)</label>
                <span className="text-xl font-bold text-emerald-400">{formatCurrency(ltv)}</span>
              </div>
              <input 
                type="range" 
                min="500" 
                max="25000" 
                step="500" 
                value={ltv} 
                onChange={(e) => setLtv(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>$500</span>
                <span>$25k+</span>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="bg-[#111] rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="space-y-6">
                
                {/* Old Way */}
                <div className="flex items-center justify-between pb-6 border-b border-white/5">
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">Manual Follow-up</p>
                    <p className="text-xs text-gray-500">~14hr response (5% close)</p>
                  </div>
                  <span className="text-xl font-semibold text-gray-300">{formatCurrency(oldRevenue)}</span>
                </div>

                {/* Clovrr Way */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-400 font-semibold mb-1 flex items-center gap-2">
                      With Clovrr AI
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] uppercase tracking-wider">Instant</span>
                    </p>
                    <p className="text-xs text-gray-500">&lt;1 min response (18% close)</p>
                  </div>
                  <span className="text-2xl font-bold text-white">{formatCurrency(clovrrRevenue)}</span>
                </div>
              </div>

              {/* Net Gain */}
              <div className="mt-8 pt-6 border-t border-emerald-500/20">
                <p className="text-xs text-emerald-500/80 uppercase tracking-widest font-semibold mb-2">Monthly Revenue Gained</p>
                <p className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-sm">
                  +{formatCurrency(netGain)}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
