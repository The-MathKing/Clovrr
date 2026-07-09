import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clientRes = await supabase.from('clients').select('id').eq('email', user.email).single();
    if (!clientRes.data) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

    const body = await req.json();
    const { leads } = body;

    const formattedLeads = leads.map((lead: Record<string, string>) => {
      const contact = lead.contact_id || lead.Phone || lead.phone || lead.Email || lead.email || '';
      const email = lead.Email || lead.email || null;
      const inferredChannel = (lead.Phone || lead.phone) ? 'sms' : (email ? 'email' : 'sms');
      
      return {
        client_id: clientRes.data.id,
        name: lead.name || lead.Name || null,
        contact_id: contact,
        email: email,
        channel: (lead.channel || inferredChannel).toLowerCase(),
        context: lead.context || lead['Inquiry Context'] || null,
        status: 'new'
      };
    });

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY in environment variables. Please add it to Vercel.' }, { status: 500 });
    }

    const { createClient: createAdminClient } = require('@supabase/supabase-js');
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      serviceKey
    );

    const { error } = await supabaseAdmin.from('leads').insert(formattedLeads);
    
    if (error) throw error;

    return NextResponse.json({ success: true, count: formattedLeads.length });
  } catch (err: any) {
    const message = err?.message || err?.details || String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
