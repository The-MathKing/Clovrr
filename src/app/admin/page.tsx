import React from 'react';
import { createClient } from '@/utils/supabase/server';
import AdminClientTable from './AdminClientTable';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // 1. Fetch all clients
  const { data: clientsData } = await supabase
    .from('clients')
    .select('id, name, email, tier')
    .order('created_at', { ascending: false });

  const clients = clientsData || [];

  // 2. Fetch all leads to aggregate counts
  const { data: leadsData } = await supabase
    .from('leads')
    .select('client_id, status');

  const leads = leadsData || [];

  // 3. Aggregate data per client and calculate amount owed
  const enrichedClients = clients.map(client => {
    const clientLeads = leads.filter(l => l.client_id === client.id);
    const total_leads = clientLeads.length;
    const qualified_leads = clientLeads.filter(l => l.status === 'qualified' || l.status === 'booked').length;
    
    let amount_owed = 0;
    const tier = client.tier || 'Free';

    if (tier === 'Pilot') {
      amount_owed = 199 + (qualified_leads * 50);
    } else if (tier === 'Growth') {
      amount_owed = 599 + (Math.max(0, qualified_leads - 10) * 40);
    } else if (tier === 'Scale') {
      amount_owed = 1499 + (Math.max(0, qualified_leads - 35) * 30);
    }

    return {
      id: client.id,
      name: client.name,
      email: client.email,
      tier,
      total_leads,
      qualified_leads,
      amount_owed
    };
  });

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Admin Overview</h1>
          <p className="text-gray-400 text-sm">Manage agency tiers, track usage, and estimate revenue.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Network Revenue</p>
          <p className="text-3xl font-bold text-emerald-400">
            ${enrichedClients.reduce((acc, c) => acc + c.amount_owed, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <AdminClientTable clients={enrichedClients} />
    </div>
  );
}
