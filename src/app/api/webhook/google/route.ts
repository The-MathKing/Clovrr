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
    const body = await req.json();

    // Google Business Messages format
    const agentId = body.agent;
    const conversationId = body.conversationId;
    const messageId = body.messageId;
    const messageText = body.message?.text;

    if (!agentId || !conversationId || !messageText) {
      // Just acknowledge receipt to prevent retries
      return new NextResponse('OK', { status: 200 });
    }

    // 1. Lookup Client by Google Agent ID
    const { data: client } = await supabase
      .from('clients')
      .select('*')
      .eq('google_agent_id', agentId)
      .single();

    if (!client) {
      console.error('No client found for Google Agent ID:', agentId);
      return new NextResponse('OK', { status: 200 });
    }

    // 2. Lookup or Create Lead
    let { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('contact_id', conversationId)
      .eq('client_id', client.id)
      .single();

    if (!lead) {
      const { data: newLead, error } = await supabase
        .from('leads')
        .insert({ client_id: client.id, contact_id: conversationId, channel: 'google' })
        .select('*')
        .single();
      if (error) throw error;
      lead = newLead;
    }

    // 3. Save User Message
    await supabase.from('conversations').insert({ lead_id: lead.id, role: 'user', content: messageText });
    await supabase.from('leads').update({ last_replied_at: new Date().toISOString(), followup_count: 0 }).eq('id', lead.id);

    // 4. Get History & Prompt
    const { data: history } = await supabase
      .from('conversations')
      .select('role, content')
      .eq('lead_id', lead.id)
      .order('created_at', { ascending: false })
      .limit(10);

    const contents = (history || []).reverse().map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const baseSystemPrompt = client.system_prompt || `You are an expert AI Lead Concierge for ${client.name}. Your objective is to help the user and encourage them to book a time.`;
    const systemPrompt = `${baseSystemPrompt}
### CONTEXT FOR THIS CONVERSATION:
- Prospect found you on Google Maps and clicked "Chat".
- Keep responses extremely fast, helpful, and direct to the point.
- Booking Link: ${client.calendly_link || 'our booking calendar'}`;

    // 5. Query Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', systemInstruction: systemPrompt });
    const result = await model.generateContent({ contents });
    let aiResponse = result.response.text().trim();

    let newStatus = 'new';
    if (aiResponse.includes(client.calendly_link || 'calendly')) newStatus = 'qualified';

    // 6. Save AI Response
    await supabase.from('conversations').insert({ lead_id: lead.id, role: 'assistant', content: aiResponse });

    const leadUpdates: any = { last_contacted_at: new Date().toISOString() };
    if (newStatus !== 'new' && lead.status !== newStatus) leadUpdates.status = newStatus;
    await supabase.from('leads').update(leadUpdates).eq('id', lead.id);

    // 7. Send Reply via Google Business API (requires a valid service account token in a real production env)
    // Here we stub out the HTTP request format as defined by Google Docs.
    if (client.google_access_token) {
      await fetch(`https://businessmessages.googleapis.com/v1/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${client.google_access_token}`
        },
        body: JSON.stringify({
          messageId: `ai-${Date.now()}`,
          representative: { representativeType: 'BOT' },
          text: aiResponse
        })
      });
    }

    // 8. Sync CRM
    await syncLeadToCRMs(client, lead, newStatus === 'qualified');

    return new NextResponse('OK', { status: 200 });

  } catch (err: any) {
    console.error('Google Webhook Error:', err);
    return new NextResponse('OK', { status: 200 }); 
  }
}
