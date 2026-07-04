import React from 'react';
import { createClient } from '@/utils/supabase/server';
import IntegrationsHub from './IntegrationsHub';
import PersonaForm from './PersonaForm';
import ChatTester from './ChatTester';

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
      
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-8 shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <h2 className="text-xl font-semibold mb-6 text-white border-b border-white/5 pb-4">Agency Profile</h2>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Company Name</label>
            <input 
              type="text" 
              defaultValue={client?.name || ''} 
              readOnly
              className="w-full px-4 py-3 bg-black border border-white/5 rounded-lg text-white opacity-70 cursor-not-allowed focus:outline-none transition-colors" 
            />
            <p className="mt-1 text-xs text-gray-500">Managed by Clovrr admin.</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Contact Email</label>
            <input 
              type="email" 
              defaultValue={client?.email || user?.email || ''} 
              readOnly
              className="w-full px-4 py-3 bg-black border border-white/5 rounded-lg text-white opacity-70 cursor-not-allowed focus:outline-none transition-colors" 
            />
          </div>
        </form>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-8 shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <h2 className="text-xl font-semibold mb-6 text-white border-b border-white/5 pb-4">Bot Configuration</h2>
        
        <PersonaForm client={client} />
      </div>

      <ChatTester />

      <IntegrationsHub client={client} />
    </div>
  );
}
