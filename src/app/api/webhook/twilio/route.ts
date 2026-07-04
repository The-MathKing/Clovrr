import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import twilio from 'twilio';

// Initialize services (Ensure these are in your .env.local)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(req: Request) {
  try {
    // 1. Parse the incoming Twilio Webhook (x-www-form-urlencoded)
    const text = await req.text();
    const params = new URLSearchParams(text);
    const from = params.get('From'); // Lead's phone number
    const to = params.get('To');     // Client's Twilio number
    const body = params.get('Body'); // The message text

    if (!from || !to || !body) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // 2. Lookup Client by the 'To' number to find their Calendly link
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('id, name, calendly_link')
      .eq('twilio_number', to)
      .single();

    if (clientError || !client) {
      console.error('Client not found for number:', to);
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // 3. Lookup or Create Lead
    let { data: lead } = await supabase
      .from('leads')
      .select('id, status')
      .eq('client_id', client.id)
      .eq('phone_number', from)
      .single();

    if (!lead) {
      const { data: newLead, error: leadInsertError } = await supabase
        .from('leads')
        .insert({ client_id: client.id, phone_number: from })
        .select('id')
        .single();
      
      if (leadInsertError) throw new Error('Failed to create lead');
      lead = newLead;
    }

    // 4. Save the incoming message to conversations
    await supabase.from('conversations').insert({
      lead_id: lead.id,
      role: 'user',
      content: body
    });

    // 5. Fetch Conversation History (last 10 messages for context)
    const { data: history } = await supabase
      .from('conversations')
      .select('role, content')
      .eq('lead_id', lead.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Format for OpenAI (needs to be ascending order)
    const messages = (history || []).reverse().map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content
    }));

    // System prompt defining the AI's persona
    const systemPrompt = `You are a highly efficient AI Lead Concierge for an agency named ${client.name}. 
Your goal is to be helpful, qualify the lead briefly (ask 1-2 relevant questions about their business), 
and ultimately get them to book a meeting using this link: ${client.calendly_link || 'our booking calendar'}.
Keep responses under 160 characters if possible. Be extremely concise, polite, and persuasive.`;

    // 6. Get AI Response from OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // or gpt-3.5-turbo for speed/cost
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const aiResponse = completion.choices[0].message?.content || "I'm sorry, I'm having trouble processing that right now.";

    // 7. Save AI response to database
    await supabase.from('conversations').insert({
      lead_id: lead.id,
      role: 'assistant',
      content: aiResponse
    });

    // 8. Send SMS back via Twilio
    await twilioClient.messages.create({
      body: aiResponse,
      from: to,
      to: from
    });

    // 9. Update Lead Status if Calendly was shared
    if (aiResponse.includes(client.calendly_link || 'calendly')) {
      await supabase.from('leads').update({ status: 'qualified' }).eq('id', lead.id);
    }

    // Twilio expects a 200 OK response with TwiML, but returning plain 200 is fine if we use the API to send the message.
    return new NextResponse('OK', { status: 200 });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
