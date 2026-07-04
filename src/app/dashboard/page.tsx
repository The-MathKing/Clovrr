import React from 'react';
import { createClient } from '@/utils/supabase/server';

export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch client details
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('email', user?.email)
    .single();

  let totalLeads = 0;
  let qualifiedLeads = 0;
  
  if (client) {
    const { count } = await supabase.from('leads').select('*', { count: 'exact', head: true }).eq('client_id', client.id);
    totalLeads = count || 0;
    
    const { count: qualCount } = await supabase.from('leads').select('*', { count: 'exact', head: true }).eq('client_id', client.id).in('status', ['qualified', 'booked']);
    qualifiedLeads = qualCount || 0;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Total Leads (All Time)</h3>
          <p className="text-3xl font-bold text-white">{totalLeads}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Qualified / Booked</h3>
          <p className="text-3xl font-bold text-emerald-400">{qualifiedLeads}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-gray-400 text-sm font-medium mb-1">AI Conversion Rate</h3>
          <p className="text-3xl font-bold text-white">
            {totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0}%
          </p>
        </div>
      </div>

      <div className="bg-emerald-900/20 border border-emerald-900/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-emerald-400 mb-2">Welcome to your Clovrr Concierge</h2>
        <p className="text-gray-300 text-sm">
          Your AI bot is currently active and listening on your Twilio number. Go to the <strong>Lead Manager</strong> to view live conversations, or update your Calendly link in <strong>Settings</strong>.
        </p>
      </div>
    </div>
  );
}
