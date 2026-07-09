'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';

type Campaign = {
  id: string;
  name: string;
  status: string;
  created_at: string;
};

export default function CampaignsClient({ initialCampaigns }: { initialCampaigns: Campaign[] }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !initialMessage || !file) {
      setError('Please fill in all fields and upload a CSV.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const leads = results.data.map((row: any) => ({
          name: row.Name || row.name || '',
          phone: row.Phone || row.phone || row['Phone Number'] || row.phoneNumber || '',
          email: row.Email || row.email || '',
          last_inbound_date: row['Last Contact Date'] || row.lastContactDate || row.date || '',
          context: row['Inquiry Context'] || row.Context || row.context || ''
        })).filter(l => l.phone || l.email); // Require phone or email

        if (leads.length === 0) {
          setError('No valid leads found in CSV. Please ensure there is a "Phone" or "Email" column.');
          setIsSubmitting(false);
          return;
        }

        try {
          const res = await fetch('/api/campaigns/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, initialMessage, leads })
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Failed to create campaign');
          }

          // Reload page to see new campaign
          window.location.reload();
        } catch (err: any) {
          setError(err.message);
          setIsSubmitting(false);
        }
      },
      error: (err) => {
        setError('Failed to parse CSV: ' + err.message);
        setIsSubmitting(false);
      }
    });
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          + New Campaign
        </button>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
              <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm text-gray-300">
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  No campaigns found. Create one to get started.
                </td>
              </tr>
            ) : (
              campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-medium text-white">{c.name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      c.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' :
                      c.status === 'completed' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {c.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-xl w-full max-w-lg p-6 relative">
            <h2 className="text-xl font-semibold text-white mb-4">Create Reactivation Campaign</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Campaign Name</label>
                <input 
                  required
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. June Dead Leads"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Initial Text Message</label>
                <textarea 
                  required
                  value={initialMessage}
                  onChange={e => setInitialMessage(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 h-24 resize-none"
                  placeholder="Hey there, are you still interested in..."
                />
                <p className="text-xs text-gray-500 mt-1">Keep it short and conversational.</p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Upload Leads (CSV)</label>
                <input 
                  required
                  type="file" 
                  accept=".csv"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">CSV should ideally contain: "Name", "Phone", "Email", "Last Contact Date", "Inquiry Context".</p>
              </div>

              {error && <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded">{error}</div>}

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Uploading...' : 'Launch Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
