import React from 'react';
import { createClient } from '@/utils/supabase/server';
import SettingsTabs from './SettingsTabs';

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
    <div className="p-8 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-8 tracking-tight">Settings</h1>
      <SettingsTabs client={client} userEmail={user?.email || ''} />
    </div>
  );
}
