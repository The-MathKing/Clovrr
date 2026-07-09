import React from 'react';
import { createClient } from '@/utils/supabase/server';
import CampaignsClient from './CampaignsClient';

export default async function CampaignsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('email', user?.email)
    .single();

  // Fetch campaigns
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*')
    .eq('client_id', client?.id)
    .order('created_at', { ascending: false });

  // Fetch lead counts for campaigns
  // We can do this in the client component or here. Let's pass campaigns down.

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Reactivation Campaigns</h1>
      </div>
      
      <CampaignsClient initialCampaigns={campaigns || []} />
    </div>
  );
}
