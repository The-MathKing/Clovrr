import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { syncLeadToCRMs } from '@/utils/crm';

const VERIFY_TOKEN = 'clovrr_meta_verify_token';

// 1. Meta Webhook Verification (GET)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WEBHOOK_VERIFIED');
    return new NextResponse(challenge, { status: 200 });
  } else {
    return new NextResponse('Forbidden', { status: 403 });
  }
}

// 2. Handle Incoming Messages (POST)
export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

  try {
    const body = await req.json();

    if (body.object !== 'page' && body.object !== 'instagram') {
      return new NextResponse('Not Found', { status: 404 });
    }

    const entry = body.entry?.[0];
    const messaging = entry?.messaging?.[0];

    if (!messaging || !messaging.message || !messaging.message.text) {
      return new NextResponse('EVENT_RECEIVED', { status: 200 }); // Ignore non-text events
    }

    const senderId = messaging.sender.id;
    const recipientId = messaging.recipient.id; // This is the Page/IG Account ID
    const messageText = messaging.message.text;

    // 1. Lookup Client by Meta Page ID
    const { data: client } = await supabase
      .from('clients')
      .select('*')
      .eq('meta_page_id', recipientId)
      .single();

    if (!client) {
      console.error('No client found for Meta Page ID:', recipientId);
      return new NextResponse('EVENT_RECEIVED', { status: 200 });
    }

    // 2. Lookup or Create Lead
    let { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('contact_id', senderId)
      .eq('client_id', client.id)
      .single();

    if (!lead) {
      const { data: newLead, error } = await supabase
        .from('leads')
        .insert({ client_id: client.id, contact_id: senderId, channel: 'meta' })
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
- Prospect is messaging you on Instagram/Facebook.
- Keep responses short, punchy, and conversational (like an Instagram DM).
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

    // 7. Send Reply via Meta Graph API
    if (client.meta_access_token) {
      await fetch(`https://graph.facebook.com/v19.0/me/messages?access_token=${client.meta_access_token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: { id: senderId },
          message: { text: aiResponse }
        })
      });
    }

    // 8. Sync CRM
    await syncLeadToCRMs(client, lead, newStatus === 'qualified');

    return new NextResponse('EVENT_RECEIVED', { status: 200 });

  } catch (err: any) {
    console.error('Meta Webhook Error:', err);
    return new NextResponse('EVENT_RECEIVED', { status: 200 }); // Always return 200 to Meta to prevent retries
  }
}
