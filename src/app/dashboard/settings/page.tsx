import React from 'react';
import { createClient } from '@/utils/supabase/server';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch client details
  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('email', user?.email)
    .single();

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>
      
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-6 text-white border-b border-gray-800 pb-4">Agency Profile</h2>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Company Name</label>
            <input 
              type="text" 
              defaultValue={client?.name || ''} 
              readOnly
              className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white opacity-70 cursor-not-allowed focus:outline-none" 
            />
            <p className="mt-1 text-xs text-gray-500">Managed by Clovrr admin.</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Contact Email</label>
            <input 
              type="email" 
              defaultValue={client?.email || user?.email || ''} 
              readOnly
              className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white opacity-70 cursor-not-allowed focus:outline-none" 
            />
          </div>
        </form>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-6 text-white border-b border-gray-800 pb-4">Bot Configuration</h2>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Twilio Phone Number</label>
            <input 
              type="text" 
              defaultValue={client?.twilio_number || 'Not assigned yet'} 
              readOnly
              className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-emerald-400 font-mono opacity-70 cursor-not-allowed focus:outline-none" 
            />
            <p className="mt-1 text-xs text-gray-500">This is the number your AI Concierge is listening on.</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Calendly Link</label>
            <input 
              type="text" 
              defaultValue={client?.calendly_link || ''} 
              className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
              placeholder="https://calendly.com/your-name/demo"
            />
            <p className="mt-1 text-xs text-gray-500">The AI will use this exact link when it qualifies a lead and tries to book a meeting.</p>
          </div>
          
          <div className="pt-4">
            <button type="button" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/50">
              Save Configuration
            </button>
          </div>
        </form>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-6 text-white border-b border-gray-800 pb-4">Omnichannel Integrations</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-950 border border-gray-800 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="text-2xl">📱</div>
              <div>
                <h3 className="text-white font-medium">Twilio SMS</h3>
                <p className="text-xs text-emerald-400">Connected ({client?.twilio_number || 'Pending Assignment'})</p>
              </div>
            </div>
            <button className="text-sm bg-gray-800 text-gray-300 px-3 py-1.5 rounded hover:bg-gray-700 transition-colors">Manage</button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-950 border border-gray-800 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="text-2xl">✉️</div>
              <div>
                <h3 className="text-white font-medium">Email (SendGrid)</h3>
                <p className="text-xs text-gray-500">Not connected</p>
              </div>
            </div>
            <button className="text-sm bg-emerald-600 text-white px-3 py-1.5 rounded hover:bg-emerald-500 transition-colors shadow-sm">Connect</button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-950 border border-gray-800 rounded-lg opacity-50">
            <div className="flex items-center gap-4">
              <div className="text-2xl">📸</div>
              <div>
                <h3 className="text-white font-medium">Instagram DMs</h3>
                <p className="text-xs text-amber-500">Requires Meta App Approval</p>
              </div>
            </div>
            <button className="text-sm bg-gray-800 text-gray-300 px-3 py-1.5 rounded cursor-not-allowed">Locked</button>
          </div>
        </div>
      </div>
    </div>
  );
}
