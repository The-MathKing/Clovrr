import React from 'react';
import { createClient } from '@/utils/supabase/server';

import LeadActions from './LeadActions';

export default async function LeadsManager() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch client details
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('email', user?.email)
    .single();

  let leads: any[] = [];
  
  if (client) {
    const { data } = await supabase
      .from('leads')
      .select('*, conversations(role, content, created_at)')
      .eq('client_id', client.id)
      .order('created_at', { ascending: false });
      
    leads = data || [];
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-blue-900/30 text-blue-400 border-blue-800';
      case 'qualified': return 'bg-emerald-900/30 text-emerald-400 border-emerald-800';
      case 'booked': return 'bg-purple-900/30 text-purple-400 border-purple-800';
      case 'disqualified': return 'bg-red-900/30 text-red-400 border-red-800';
      default: return 'bg-gray-800 text-gray-400 border-gray-700';
    }
  };

  const getChannelIcon = (channel: string) => {
    if (channel === 'sms') return '📱';
    if (channel === 'email') return '✉️';
    if (channel === 'instagram') return '📸';
    return '💬';
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lead Manager</h1>
      </div>
      
      <LeadActions />

      <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-950 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-400">Lead</th>
                <th className="px-6 py-4 font-medium text-gray-400">Status</th>
                <th className="px-6 py-4 font-medium text-gray-400">Date Added</th>
                <th className="px-6 py-4 font-medium text-gray-400 text-right">Messages</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No leads found. Import a CSV or wait for inbound messages.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{lead.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        {getChannelIcon(lead.channel)} {lead.contact_id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(lead.status)}`}>
                        {lead.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-400">
                      {lead.conversations?.length || 0} msgs
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
