import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import twilio from 'twilio';

export async function POST(req: Request) {
  // Initialize services inside handler to prevent build-time crashes when env vars are missing
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
  );
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'placeholder');
  const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID || 'ACplaceholder', 
    process.env.TWILIO_AUTH_TOKEN || 'placeholder'
  );

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
    // Look for an existing lead by contact_id and client_id
    const { data: existingLead, error: leadError } = await supabase
      .from('leads')
      .select('id, status, name, context')
      .eq('contact_id', from)
      .eq('client_id', client.id)
      .single();

    let lead = existingLead;

    if (leadError || !existingLead) {
      // Create new lead if they don't exist
      const { data: newLead, error: leadInsertError } = await supabase
        .from('leads')
        .insert({ client_id: client.id, contact_id: from, channel: 'sms' })
        .select('id, status, name, context')
        .single();
    
      if (leadInsertError) throw new Error('Failed to create lead');
      lead = newLead;
    }

    if (!lead) throw new Error('Lead could not be found or created');

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

    const systemPrompt = `You are an expert AI Lead Concierge named Clovrr, acting on behalf of ${client.name}, an independent insurance agency. Your sole objective is to re-engage past prospects who requested a quote but stalled out, or existing single-policy clients who qualify for a bundle discount.

### CONTEXT FOR THIS CONVERSATION:
- Prospect Name: ${lead.name || 'Friend'}
- Campaign Type: Inbound Response
- Original Inquiry/Policy: ${lead.context || 'They texted us directly'}

### CORE BEHAVIOR RULES:
1. BREVITY IS KING: People read texts and quick emails on the move. Keep every single response under 160 characters (1-2 sentences maximum). Do not write blocks of text.
2. NATURAL & TONED-DOWN: Do not sound like a marketing bot. Do not use corporate fluff ("I hope this email finds you well", "Valued customer"). Write like a busy but helpful account manager. Use lowercase naturally if texting.
3. STRICT PERSISTENCE: If the prospect is vague, gently guide them back to booking a time. 
4. NO INVENTING POLICY DETAILS: Never quote exact premiums or coverage numbers unless explicitly provided in the context data. If asked for pricing, say: "Rates change daily, let's grab 5 mins for the agent to pull up the exact numbers for you."

### CONVERSATIONAL FLOW:
- Step 1 (Opening): Acknowledge the context immediately. Ask a direct, low-friction question.
- Step 2 (Qualification & Handling): Answer any basic questions, overcome objections (e.g., "Too busy" -> "Totally get it, that's why we can text you the quote instead. What's a good day?").
- Step 3 (The Close): When they show any intent or curiosity, immediately offer a clean booking bridge. Do not ask "When are you free?" Instead, provide an option: "Does tomorrow morning or Wednesday afternoon work better for a quick call?"
Always use this link when offering to book: ${client.calendly_link || 'our booking calendar'}

### COMPLIANCE GUARDRAILS:
- If the user uses the words "STOP", "UNSUBSCRIBE", "REMOVE", or expresses anger/explicit disinterest, immediately reply with exactly: "Understood. You have been opted out." and append the tag [STATUS: OPT_OUT] to the end of your response for the backend to read.`;

    // 6. Get AI Response from Gemini
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro',
      systemInstruction: systemPrompt 
    });

    const result = await model.generateContent({ contents });
    let aiResponse = result.response.text().trim();

    // 7. Compliance Filter Check
    let newStatus = 'new';
    if (aiResponse.includes('[STATUS: OPT_OUT]')) {
      newStatus = 'disqualified';
      // Strip the tag from the user-facing message
      aiResponse = aiResponse.replace('[STATUS: OPT_OUT]', '').trim();
    } else if (aiResponse.includes(client.calendly_link || 'calendly')) {
      newStatus = 'qualified';
    }

    // 8. Save AI response to database
    await supabase.from('conversations').insert({
      lead_id: lead.id,
      role: 'assistant', // we save as 'assistant' in DB for consistency
      content: aiResponse
    });

    // 9. Send SMS back via Twilio
    await twilioClient.messages.create({
      body: aiResponse,
      from: to,
      to: from
    });

    // 10. Update Lead Status
    if (newStatus !== 'new' && lead.status !== newStatus) {
      await supabase.from('leads').update({ status: newStatus }).eq('id', lead.id);
    }

    return new NextResponse('OK', { status: 200 });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
