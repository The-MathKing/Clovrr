'use client';

import React, { useState } from 'react';

type IntegrationsClientData = {
  twilio_number?: string;
  twilio_account_sid?: string;
  twilio_auth_token?: string;
  sendgrid_api_key?: string;
  sendgrid_from_email?: string;
  ghl_api_key?: string;
  ghl_location_id?: string;
  hubspot_access_token?: string;
  avg_policy_value?: number;
};

export default function IntegrationsHub({ client, filter = 'all' }: { client: IntegrationsClientData | null, filter?: string }) {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    twilio_number: client?.twilio_number || '',
    twilio_account_sid: client?.twilio_account_sid || '',
    twilio_auth_token: client?.twilio_auth_token || '',
    sendgrid_api_key: client?.sendgrid_api_key || '',
    sendgrid_from_email: client?.sendgrid_from_email || '',
    ghl_api_key: client?.ghl_api_key || '',
    ghl_location_id: client?.ghl_location_id || '',
    hubspot_access_token: client?.hubspot_access_token || '',
    avg_policy_value: client?.avg_policy_value || 500,
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
        window.location.reload(); 
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
    <div className="space-y-4">
      {/* MESSAGING FILTER */}
      {(filter === 'all' || filter === 'messaging') && (
        <>
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

          <div className="flex items-center justify-between p-4 bg-[#111] border border-gray-800/50 rounded-lg hover:border-gray-700 transition-colors">
            <div className="flex items-center gap-4">
              <div className="text-2xl opacity-80">💬</div>
              <div>
                <h3 className="text-white font-medium text-sm">WhatsApp Business</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {client?.twilio_account_sid ? 'Ready via Twilio' : 'Requires Twilio Setup'}
                </p>
              </div>
            </div>
            <button onClick={() => setActiveModal('whatsapp')} className="text-sm bg-[#1a1a1a] border border-gray-800 text-gray-300 px-4 py-1.5 rounded-md hover:bg-gray-800 hover:text-white transition-all">
              View Info
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#111] border border-gray-800/50 rounded-lg hover:border-gray-700 transition-colors">
            <div className="flex items-center gap-4">
              <div className="text-2xl opacity-80">📸</div>
              <div>
                <h3 className="text-white font-medium text-sm">Meta (FB/Instagram)</h3>
                <p className="text-xs text-gray-400 mt-0.5">Configure Graph API</p>
              </div>
            </div>
            <button onClick={() => setActiveModal('meta')} className="text-sm bg-[#1a1a1a] border border-gray-800 text-gray-300 px-4 py-1.5 rounded-md hover:bg-gray-800 hover:text-white transition-all">
              Setup
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#111] border border-gray-800/50 rounded-lg hover:border-gray-700 transition-colors">
            <div className="flex items-center gap-4">
              <div className="text-2xl opacity-80">🗺️</div>
              <div>
                <h3 className="text-white font-medium text-sm">Google Business</h3>
                <p className="text-xs text-gray-400 mt-0.5">Configure Google API</p>
              </div>
            </div>
            <button onClick={() => setActiveModal('google')} className="text-sm bg-[#1a1a1a] border border-gray-800 text-gray-300 px-4 py-1.5 rounded-md hover:bg-gray-800 hover:text-white transition-all">
              Setup
            </button>
          </div>

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
        </>
      )}

      {/* VOICE FILTER */}
      {(filter === 'all' || filter === 'voice') && (
        <div className="flex items-center justify-between p-4 bg-[#111] border border-emerald-500/30 rounded-lg hover:border-emerald-500/50 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <div className="flex items-center gap-4">
            <div className="text-2xl opacity-80">🎙️</div>
            <div>
              <h3 className="text-emerald-400 font-medium text-sm">Twilio Voice + Gemini AI</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Enable conversational voice AI on your Twilio number
              </p>
            </div>
          </div>
          <button onClick={() => setActiveModal('voice')} className="text-sm bg-emerald-600/20 border border-emerald-500/50 text-emerald-400 px-4 py-1.5 rounded-md hover:bg-emerald-600/40 transition-all">
            Configure
          </button>
        </div>
      )}

      {/* CRMS FILTER */}
      {(filter === 'all' || filter === 'crms') && (
        <>
          <div className="flex items-center justify-between p-4 bg-[#111] border border-gray-800/50 rounded-lg hover:border-gray-700 transition-colors">
            <div className="flex items-center gap-4">
              <div className="text-2xl opacity-80">🏢</div>
              <div>
                <h3 className="text-white font-medium text-sm">GoHighLevel</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {client?.ghl_api_key ? 'Connected' : 'Not configured'}
                </p>
              </div>
            </div>
            <button onClick={() => setActiveModal('gohighlevel')} className="text-sm bg-[#1a1a1a] border border-gray-800 text-gray-300 px-4 py-1.5 rounded-md hover:bg-gray-800 hover:text-white transition-all">
              {client?.ghl_api_key ? 'Manage' : 'Connect'}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#111] border border-gray-800/50 rounded-lg hover:border-gray-700 transition-colors">
            <div className="flex items-center gap-4">
              <div className="text-2xl opacity-80">⚙️</div>
              <div>
                <h3 className="text-white font-medium text-sm">HubSpot</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {client?.hubspot_access_token ? 'Connected' : 'Not configured'}
                </p>
              </div>
            </div>
            <button onClick={() => setActiveModal('hubspot')} className="text-sm bg-[#1a1a1a] border border-gray-800 text-gray-300 px-4 py-1.5 rounded-md hover:bg-gray-800 hover:text-white transition-all">
              {client?.hubspot_access_token ? 'Manage' : 'Connect'}
            </button>
          </div>
        </>
      )}

      {/* WIDGET FILTER */}
      {(filter === 'all' || filter === 'widget') && (
        <div className="flex items-center justify-between p-4 bg-[#111] border border-gray-800/50 rounded-lg hover:border-gray-700 transition-colors">
          <div className="flex items-center gap-4">
            <div className="text-2xl opacity-80">🌐</div>
            <div>
              <h3 className="text-white font-medium text-sm">Website Live Chat</h3>
              <p className="text-xs text-gray-400 mt-0.5">Embed the AI on your site</p>
            </div>
          </div>
          <button onClick={() => setActiveModal('widget_setup')} className="text-sm bg-[#1a1a1a] border border-gray-800 text-gray-300 px-4 py-1.5 rounded-md hover:bg-gray-800 hover:text-white transition-all">
            Get Code
          </button>
        </div>
      )}

      {/* MODALS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111] border border-gray-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-900"></div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                {activeModal === 'twilio' && 'Configure Twilio SMS'}
                {activeModal === 'whatsapp' && 'WhatsApp Business Info'}
                {activeModal === 'meta' && 'Configure Meta Graph API'}
                {activeModal === 'google' && 'Configure Google Business API'}
                {activeModal === 'voice' && 'Configure Inbound Voice AI'}
                {activeModal === 'sendgrid' && 'Configure SendGrid'}
                {activeModal === 'gohighlevel' && 'Configure GoHighLevel'}
                {activeModal === 'hubspot' && 'Configure HubSpot'}
                {activeModal === 'business' && 'Configure Business Metrics'}
                {activeModal === 'widget_setup' && 'Live Chat Widget Code'}
              </h3>
              
              <form onSubmit={handleSave} className="space-y-4">
                {activeModal === 'twilio' && (
                  <>
                    <div className="mb-4 text-xs text-gray-400 bg-[#1a1a1a] p-3 rounded border border-gray-800">
                      <p className="mb-2">To connect Twilio, you need to provide your own Twilio phone number and API credentials.</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Log in to the <a href="https://console.twilio.com/" target="_blank" rel="noreferrer" className="text-emerald-500 hover:underline">Twilio Console</a>.</li>
                        <li>Find your <strong>Account SID</strong> and <strong>Auth Token</strong> on the main dashboard.</li>
                        <li>Ensure you have purchased a <strong>Twilio Phone Number</strong> with SMS capabilities.</li>
                      </ul>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Twilio Number</label>
                      <input type="text" value={formData.twilio_number} onChange={e => setFormData({...formData, twilio_number: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-800 rounded p-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors" placeholder="+1234567890" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Account SID</label>
                      <input type="password" value={formData.twilio_account_sid} onChange={e => setFormData({...formData, twilio_account_sid: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-800 rounded p-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors" placeholder="AC..." />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Auth Token</label>
                      <input type="password" value={formData.twilio_auth_token} onChange={e => setFormData({...formData, twilio_auth_token: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-800 rounded p-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors" placeholder="••••••••••••••••" />
                    </div>
                  </>
                )}

                {activeModal === 'whatsapp' && (
                  <div className="mb-4 text-xs text-gray-400 bg-[#1a1a1a] p-4 rounded border border-gray-800 leading-relaxed">
                    <p className="mb-3 font-medium text-white">WhatsApp is automatically enabled if your Twilio number supports it!</p>
                    <p className="mb-3">To use WhatsApp:</p>
                    <ul className="list-disc pl-4 space-y-2 mb-4">
                      <li>Go to Twilio Console &gt; Messaging &gt; Senders &gt; WhatsApp Senders.</li>
                      <li>Register your connected Twilio number ({client?.twilio_number || 'Not connected'}) for WhatsApp.</li>
                      <li>Users can now message your bot on WhatsApp by sending texts to your number! Our webhook automatically handles `whatsapp:+` prefixes.</li>
                    </ul>
                  </div>
                )}

                {activeModal === 'meta' && (
                  <div className="mb-4 text-xs text-gray-400 bg-[#1a1a1a] p-4 rounded border border-gray-800 leading-relaxed">
                    <p className="mb-3 text-emerald-500 font-medium border-b border-gray-800 pb-2">Developer Approval Required</p>
                    <p className="mb-3">To connect Instagram and Facebook, you must register a Meta Developer App:</p>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>Go to <a href="https://developers.facebook.com/" target="_blank" className="text-emerald-500 hover:underline">Meta for Developers</a>.</li>
                      <li>Create an app and configure <strong>Messenger</strong> and <strong>Instagram Graph API</strong>.</li>
                      <li>Set your webhook URL to: <code className="bg-black px-1 py-0.5 rounded text-emerald-400">https://your-domain.com/api/webhook/meta</code></li>
                      <li>Contact Clovrr support to input your Page Access Tokens once approved.</li>
                    </ul>
                  </div>
                )}

                {activeModal === 'google' && (
                  <div className="mb-4 text-xs text-gray-400 bg-[#1a1a1a] p-4 rounded border border-gray-800 leading-relaxed">
                    <p className="mb-3 text-emerald-500 font-medium border-b border-gray-800 pb-2">Developer Approval Required</p>
                    <p className="mb-3">To connect Google Maps chat, you must register with Google:</p>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>Go to <a href="https://businessmessages.google.com/" target="_blank" className="text-emerald-500 hover:underline">Google Business Messages Console</a>.</li>
                      <li>Create a partner account and configure your brand.</li>
                      <li>Set your webhook URL to: <code className="bg-black px-1 py-0.5 rounded text-emerald-400">https://your-domain.com/api/webhook/google</code></li>
                      <li>Contact Clovrr support to input your Service Account keys once approved.</li>
                    </ul>
                  </div>
                )}

                {activeModal === 'voice' && (
                  <div className="mb-4 text-xs text-gray-400 bg-[#1a1a1a] p-4 rounded border border-gray-800 leading-relaxed">
                    <p className="mb-3 font-medium text-emerald-400">Twilio Voice + Gemini AI</p>
                    <p className="mb-3">Your Twilio number can now answer inbound phone calls using Google Gemini!</p>
                    <ul className="list-disc pl-4 space-y-2 mb-4">
                      <li>Go to your Twilio Console Phone Numbers list.</li>
                      <li>Click your number ({client?.twilio_number || 'Not connected'}).</li>
                      <li>Scroll down to <strong>Voice & Fax</strong>.</li>
                      <li>Set "A CALL COMES IN" to Webhook, and set the URL to: <br/><code className="bg-black px-1 py-0.5 rounded text-emerald-400 inline-block mt-1">https://your-domain.com/api/webhook/voice</code></li>
                    </ul>
                    <p className="text-gray-500 italic mt-2">Cost: ~$0.02/minute (Twilio Voice) + Gemini API Token costs.</p>
                  </div>
                )}

                {activeModal === 'widget_setup' && (
                  <div className="mb-4 text-xs text-gray-400 bg-[#1a1a1a] p-4 rounded border border-gray-800 leading-relaxed">
                    <p className="mb-3 font-medium text-white">Embed Code</p>
                    <p className="mb-3">Copy and paste this snippet into the <code>&lt;head&gt;</code> of your website (WordPress, Webflow, Shopify) to enable the Live Chat widget:</p>
                    <div className="bg-black p-3 rounded font-mono text-emerald-400 text-[10px] overflow-x-auto whitespace-pre">
                      {`<script src="https://your-domain.com/widget.js" data-clovrr-id="${client?.id || 'CLIENT_ID'}"></script>`}
                    </div>
                  </div>
                )}
                {activeModal === 'sendgrid' && (
                  <>
                    <div className="mb-4 text-xs text-gray-400 bg-[#1a1a1a] p-3 rounded border border-gray-800">
                      <p className="mb-2">Connect SendGrid to send emails on your behalf.</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Log in to your <a href="https://app.sendgrid.com/" target="_blank" rel="noreferrer" className="text-emerald-500 hover:underline">SendGrid Dashboard</a>.</li>
                        <li>Navigate to <strong>Settings</strong> &gt; <strong>API Keys</strong>.</li>
                        <li>Create a new API Key with <strong>Restricted Access</strong> (Mail Send only) and paste it below.</li>
                        <li>Ensure you configure the <strong>Inbound Parse Webhook</strong> to point to `/api/webhook/sendgrid`.</li>
                      </ul>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">SendGrid From Email</label>
                      <input type="email" value={formData.sendgrid_from_email} onChange={e => setFormData({...formData, sendgrid_from_email: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-800 rounded p-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors" placeholder="hello@youragency.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">API Key</label>
                      <input type="password" value={formData.sendgrid_api_key} onChange={e => setFormData({...formData, sendgrid_api_key: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-800 rounded p-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors" placeholder="SG.xxx..." />
                    </div>
                  </>
                )}
                {activeModal === 'gohighlevel' && (
                  <>
                    <div className="mb-4 text-xs text-gray-400 bg-[#1a1a1a] p-3 rounded border border-gray-800">
                      <p className="mb-2">Connect your GoHighLevel sub-account API.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">API Key</label>
                      <input type="password" value={formData.ghl_api_key} onChange={e => setFormData({...formData, ghl_api_key: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-800 rounded p-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors" placeholder="GHL API Key" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Location ID</label>
                      <input type="text" value={formData.ghl_location_id} onChange={e => setFormData({...formData, ghl_location_id: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-800 rounded p-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors" placeholder="Location ID" />
                    </div>
                  </>
                )}
                {activeModal === 'hubspot' && (
                  <>
                    <div className="mb-4 text-xs text-gray-400 bg-[#1a1a1a] p-3 rounded border border-gray-800">
                      <p className="mb-2">Connect your HubSpot account via Private App Access Token.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Access Token</label>
                      <input type="password" value={formData.hubspot_access_token} onChange={e => setFormData({...formData, hubspot_access_token: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-800 rounded p-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors" placeholder="pat-na1-..." />
                    </div>
                  </>
                )}
                {activeModal === 'business' && (
                  <>
                    <div className="mb-4 text-xs text-gray-400 bg-[#1a1a1a] p-3 rounded border border-gray-800">
                      <p>Configure metrics used for calculating your dashboard ROI numbers.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Average Policy Value ($)</label>
                      <input type="number" value={formData.avg_policy_value} onChange={e => setFormData({...formData, avg_policy_value: parseInt(e.target.value) || 0})} className="w-full bg-[#0a0a0a] border border-gray-800 rounded p-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors" placeholder="500" />
                    </div>
                  </>
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
