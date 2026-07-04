import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import twilio from 'twilio';

// Initialize services
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(req: Request) {
  try {
    // 1. Parse the incoming Twilio Webhook
    const text = await req.text();
    const params = new URLSearchParams(text);
    const from = params.get('From'); 
    const to = params.get('To');     
    const body = params.get('Body'); 

    if (!from || !to || !body) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // 2. Lookup Client by 'To' number
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

    // 5. Fetch Conversation History
    const { data: history } = await supabase
      .from('conversations')
      .select('role, content')
      .eq('lead_id', lead.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Format for Gemini (needs 'user' or 'model' roles)
    const contents = (history || []).reverse().map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const systemPrompt = `You are a highly efficient AI Lead Concierge for an agency named ${client.name}. 
Your goal is to be helpful, qualify the lead briefly (ask 1-2 relevant questions about their business), 
and ultimately get them to book a meeting using this link: ${client.calendly_link || 'our booking calendar'}.
Keep responses under 160 characters if possible. Be extremely concise, polite, and persuasive.`;

    // 6. Get AI Response from Gemini
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro',
      systemInstruction: systemPrompt 
    });

    const result = await model.generateContent({ contents });
    const aiResponse = result.response.text();

    // 7. Save AI response to database
    await supabase.from('conversations').insert({
      lead_id: lead.id,
      role: 'assistant', // we save as 'assistant' in DB for consistency
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

    return new NextResponse('OK', { status: 200 });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
