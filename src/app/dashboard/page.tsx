import React from 'react';
import { createClient } from '@/utils/supabase/server';

export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch client details
  const { data: client } = await supabase
    .from('clients')
    .select('id, avg_policy_value')
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 shadow-2xl flex flex-col justify-center relative overflow-hidden group hover:border-white/10 transition-colors">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <h3 className="text-gray-400 text-sm font-medium mb-1">Total Leads (All Time)</h3>
          <p className="text-3xl font-bold text-white">{totalLeads}</p>
        </div>
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 shadow-2xl flex flex-col justify-center relative overflow-hidden group hover:border-white/10 transition-colors">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <svg width="40" height="40" viewBox="0 0 100 100" fill="currentColor" className="text-emerald-500"><circle cx="50" cy="50" r="40" /></svg>
          </div>
          <h3 className="text-gray-400 text-sm font-medium mb-1 relative z-10">Qualified / Booked</h3>
          <p className="text-3xl font-bold text-emerald-400 relative z-10">{qualifiedLeads}</p>
        </div>
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 shadow-2xl flex flex-col justify-center relative overflow-hidden group hover:border-white/10 transition-colors">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <h3 className="text-gray-400 text-sm font-medium mb-1">AI Conversion Rate</h3>
          <p className="text-3xl font-bold text-white">
            {totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0}%
          </p>
        </div>
        <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-6 shadow-2xl flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
          <h3 className="text-emerald-500/80 text-xs uppercase tracking-wider font-semibold mb-1">Est. Revenue Recovered</h3>
          <p className="text-3xl font-bold text-emerald-400">
             ${(qualifiedLeads * (client?.avg_policy_value || 500)).toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-500/50 mt-1 uppercase tracking-wide">@ ${client?.avg_policy_value || 500} avg value per lead</p>
        </div>
      </div>

      <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
        <h2 className="text-lg font-semibold text-emerald-400 mb-2">Welcome to your Clovrr Concierge</h2>
        <p className="text-gray-300 text-sm leading-relaxed max-w-3xl">
          Your AI bot is currently active and listening on your Twilio number. Go to the <strong>Lead Manager</strong> to view live conversations, or update your Calendly link in <strong>Settings</strong>.
        </p>
      </div>
    </div>
  );
}
