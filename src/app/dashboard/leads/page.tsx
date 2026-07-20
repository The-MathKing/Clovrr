import React from 'react';
import { createClient } from '@/utils/supabase/server';
import LeadActions from './LeadActions';
import LeadsTable from './LeadsTable';

export default async function LeadsManager() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch client details
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('email', user?.email)
    .single();

  let leads: Record<string, unknown>[] = [];
  
  if (client) {
    const { data } = await supabase
      .from('leads')
      .select('*, conversations(role, content, created_at)')
      .eq('client_id', client.id)
      .order('created_at', { ascending: false });
      
    leads = data || [];
  }

  const isFree = !user?.user_metadata?.tier || user?.user_metadata?.tier === 'Free';

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lead Manager</h1>
      </div>
      
      <LeadActions isFree={isFree} />

      <LeadsTable leads={leads} />
    </div>
  );
}
