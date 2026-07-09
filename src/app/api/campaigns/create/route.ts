import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .eq('email', user.email)
      .single();

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const body = await req.json();
    const { name, initialMessage, leads } = body;

    if (!name || !initialMessage || !leads || !Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json({ error: 'Missing required fields or leads array is empty' }, { status: 400 });
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY in environment variables. Please add it to Vercel.' }, { status: 500 });
    }

    const { createClient: createAdminClient } = require('@supabase/supabase-js');
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      serviceKey
    );

    // 1. Create the Campaign
    const { data: campaign, error: campaignError } = await supabaseAdmin
      .from('campaigns')
      .insert({
        client_id: client.id,
        name: name,
        initial_message: initialMessage,
        status: 'active' // Immediately set to active for cron to pick up
      })
      .select('id')
      .single();

    if (campaignError || !campaign) {
      console.error('Failed to create campaign:', campaignError);
      return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
    }

    // 2. Format leads for insertion
    const leadsToInsert = leads.map((lead: any) => ({
      client_id: client.id,
      campaign_id: campaign.id,
      name: lead.name || null,
      contact_id: lead.phone || lead.email, // Fallback to email if no phone
      email: lead.email || null,
      last_inbound_date: lead.last_inbound_date ? new Date(lead.last_inbound_date).toISOString() : null,
      context: lead.context || null,
      status: 'new', // Since it's a reactivation, they start as new
      channel: lead.phone ? 'sms' : 'email'
    }));

    // 3. Batch insert leads (using contact_id instead of phone_number)
    // We'll upsert based on client_id and contact_id
    const { error: leadsError } = await supabaseAdmin
      .from('leads')
      .upsert(leadsToInsert, { onConflict: 'client_id, contact_id' });

    if (leadsError) {
      console.error('Failed to insert leads:', leadsError);
      return NextResponse.json({ error: 'Failed to insert leads' }, { status: 500 });
    }

    return NextResponse.json({ success: true, campaignId: campaign.id });
  } catch (error: any) {
    console.error('Create campaign error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
