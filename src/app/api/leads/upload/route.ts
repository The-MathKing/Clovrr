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

    const formattedLeads = leads.map((lead: Record<string, string>) => ({
      client_id: clientRes.data.id,
      name: lead.name || null,
      contact_id: lead.contact_id,
      channel: (lead.channel || 'sms').toLowerCase(),
      context: lead.context || null,
      status: 'new'
    }));

    const { error } = await supabase.from('leads').insert(formattedLeads);
    
    if (error) throw error;

    return NextResponse.json({ success: true, count: formattedLeads.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
