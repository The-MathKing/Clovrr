'use client';

import React, { useState } from 'react';

export default function IntegrationsHub({ client }: { client: any }) {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    twilio_number: client?.twilio_number || '',
    twilio_account_sid: client?.twilio_account_sid || '',
    twilio_auth_token: client?.twilio_auth_token || '',
    sendgrid_api_key: client?.sendgrid_api_key || '',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/settings/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setActiveModal(null);
        // Toast could go here
        window.location.reload(); // Refresh to update server components
      } else {
        alert('Failed to save settings.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving settings.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#0a0a0a] border border-gray-800/50 rounded-xl p-8 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      <h2 className="text-xl font-semibold mb-6 text-white border-b border-gray-800/50 pb-4 relative z-10">Omnichannel Integrations</h2>
      
      <div className="space-y-4 relative z-10">
        {/* Twilio */}
        <div className="flex items-center justify-between p-4 bg-[#111] border border-gray-800/50 rounded-lg hover:border-gray-700 transition-colors">
          <div className="flex items-center gap-4">
            <div className="text-2xl opacity-80">📱</div>
            <div>
              <h3 className="text-white font-medium text-sm">Twilio SMS</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {client?.twilio_account_sid ? `Connected (${client?.twilio_number})` : 'Not configured'}
              </p>
            </div>
          </div>
          <button onClick={() => setActiveModal('twilio')} className="text-sm bg-[#1a1a1a] border border-gray-800 text-gray-300 px-4 py-1.5 rounded-md hover:bg-gray-800 hover:text-white transition-all">
            {client?.twilio_account_sid ? 'Manage' : 'Connect'}
          </button>
        </div>

        {/* SendGrid */}
        <div className="flex items-center justify-between p-4 bg-[#111] border border-gray-800/50 rounded-lg hover:border-gray-700 transition-colors">
          <div className="flex items-center gap-4">
            <div className="text-2xl opacity-80">✉️</div>
            <div>
              <h3 className="text-white font-medium text-sm">Email (SendGrid)</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {client?.sendgrid_api_key ? 'Connected' : 'Not configured'}
              </p>
            </div>
          </div>
          <button onClick={() => setActiveModal('sendgrid')} className="text-sm bg-[#1a1a1a] border border-gray-800 text-gray-300 px-4 py-1.5 rounded-md hover:bg-gray-800 hover:text-white transition-all">
            {client?.sendgrid_api_key ? 'Manage' : 'Connect'}
          </button>
        </div>

        {/* Instagram - Locked */}
        <div className="flex items-center justify-between p-4 bg-[#111] border border-gray-800/50 rounded-lg opacity-50 cursor-not-allowed">
          <div className="flex items-center gap-4">
            <div className="text-2xl opacity-50">📸</div>
            <div>
              <h3 className="text-white font-medium text-sm">Instagram DMs</h3>
              <p className="text-xs text-gray-500 mt-0.5">Requires Meta App Approval</p>
            </div>
          </div>
          <button disabled className="text-sm bg-[#1a1a1a] border border-gray-800 text-gray-500 px-4 py-1.5 rounded-md">Locked</button>
        </div>
      </div>

      {/* MODALS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111] border border-gray-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-900"></div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                {activeModal === 'twilio' ? 'Configure Twilio SMS' : 'Configure SendGrid'}
              </h3>
              
              <form onSubmit={handleSave} className="space-y-4">
                {activeModal === 'twilio' && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Twilio Number</label>
                      <input type="text" value={formData.twilio_number} onChange={e => setFormData({...formData, twilio_number: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-800 rounded p-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors" placeholder="+1234567890" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Account SID</label>
                      <input type="password" value={formData.twilio_account_sid} onChange={e => setFormData({...formData, twilio_account_sid: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-800 rounded p-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Auth Token</label>
                      <input type="password" value={formData.twilio_auth_token} onChange={e => setFormData({...formData, twilio_auth_token: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-800 rounded p-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors" />
                    </div>
                  </>
                )}
                {activeModal === 'sendgrid' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">API Key</label>
                    <input type="password" value={formData.sendgrid_api_key} onChange={e => setFormData({...formData, sendgrid_api_key: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-800 rounded p-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors" placeholder="SG.xxx..." />
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800/50 mt-6">
                  <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
                  <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-medium transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50">
                    {loading ? 'Saving...' : 'Save Keys'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
