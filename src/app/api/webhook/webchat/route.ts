import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { syncLeadToCRMs } from '@/utils/crm';

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

  try {
    const { client_id, session_id, message } = await req.json();

    if (!client_id || !session_id || !message) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // 1. Fetch Client
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', client_id)
      .single();

    if (clientError || !client) {
      return NextResponse.json({ error: 'Invalid client ID' }, { status: 404 });
    }

    // 2. Lookup or Create Lead (using session_id as the contact_id since we don't have phone numbers yet for anonymous web traffic)
    let { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('contact_id', session_id)
      .eq('client_id', client.id)
      .single();

    if (!lead) {
      const { data: newLead, error } = await supabase
        .from('leads')
        .insert({ client_id: client.id, contact_id: session_id, channel: 'webchat' })
        .select('*')
        .single();
      if (error) throw error;
      lead = newLead;
    }

    // 3. Save User Message
    await supabase.from('conversations').insert({
      lead_id: lead.id,
      role: 'user',
      content: message
    });

    await supabase.from('leads').update({ last_replied_at: new Date().toISOString(), followup_count: 0 }).eq('id', lead.id);

    // 4. Get History
    const { data: history } = await supabase
      .from('conversations')
      .select('role, content')
      .eq('lead_id', lead.id)
      .order('created_at', { ascending: false })
      .limit(15);

    const contents = (history || []).reverse().map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // 5. System Prompt
    const baseSystemPrompt = client.system_prompt || `You are an expert AI Lead Concierge for ${client.name}. Your objective is to help the user and encourage them to book a time.`;
    const systemPrompt = `${baseSystemPrompt}
### CONTEXT FOR THIS CONVERSATION:
- Prospect is chatting with you via the live Website Chat Widget.
- Your goal is to answer questions quickly and get them to book a meeting or capture their real contact info.
- Booking Link: ${client.calendly_link || 'our booking calendar'}`;

    // 6. Query Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', systemInstruction: systemPrompt });
    const result = await model.generateContent({ contents });
    let aiResponse = result.response.text().trim();

    // 7. Check for Booking
    let newStatus = 'new';
    if (aiResponse.includes(client.calendly_link || 'calendly')) {
      newStatus = 'qualified';
    }

    // 8. Save AI Response
    await supabase.from('conversations').insert({
      lead_id: lead.id,
      role: 'assistant',
      content: aiResponse
    });

    const leadUpdates: any = { last_contacted_at: new Date().toISOString() };
    if (newStatus !== 'new' && lead.status !== newStatus) {
      leadUpdates.status = newStatus;
    }
    await supabase.from('leads').update(leadUpdates).eq('id', lead.id);

    // 9. Sync CRM
    await syncLeadToCRMs(client, lead, newStatus === 'qualified');

    // 10. Return to Widget
    return NextResponse.json({ text: aiResponse });

  } catch (err: any) {
    console.error('Webchat Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
