'use client';
import React, { useState } from 'react';

type ClientData = {
  id: string;
  name: string;
  email: string;
  tier: string;
  total_leads: number;
  qualified_leads: number;
  amount_owed: number;
};

export default function AdminClientTable({ clients }: { clients: ClientData[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleTierChange = async (clientId: string, newTier: string) => {
    setLoadingId(clientId);
    try {
      const res = await fetch('/api/admin/update-tier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, tier: newTier }),
      });
      if (!res.ok) throw new Error('Failed to update');
      window.location.reload();
    } catch (err) {
      alert('Error updating tier');
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-white/5 text-gray-400 font-medium border-b border-white/5">
            <tr>
              <th className="px-6 py-4">Agency</th>
              <th className="px-6 py-4">Total Leads</th>
              <th className="px-6 py-4">Qualified / Booked</th>
              <th className="px-6 py-4">Est. Amount Owed</th>
              <th className="px-6 py-4 text-right">Plan Tier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {clients.map(c => (
              <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-white">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.email}</div>
                </td>
                <td className="px-6 py-4 font-mono">{c.total_leads}</td>
                <td className="px-6 py-4 font-mono text-emerald-400">{c.qualified_leads}</td>
                <td className="px-6 py-4 font-mono font-medium">${c.amount_owed.toFixed(2)}</td>
                <td className="px-6 py-4 text-right">
                  <select
                    disabled={loadingId === c.id}
                    value={c.tier || 'Free'}
                    onChange={(e) => handleTierChange(c.id, e.target.value)}
                    className="bg-black border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                  >
                    <option value="Free">Free</option>
                    <option value="Pilot">Pilot</option>
                    <option value="Growth">Growth</option>
                    <option value="Scale">Scale</option>
                  </select>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No accounts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
