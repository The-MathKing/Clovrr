import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  // Initialize services inside handler to prevent build-time crashes when env vars are missing
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
  );
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'placeholder');

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
      .select('id, name, calendly_link, system_prompt, twilio_account_sid, twilio_auth_token')
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

    // Update last_replied_at and reset followup_count
    await supabase.from('leads').update({
      last_replied_at: new Date().toISOString(),
      followup_count: 0
    }).eq('id', lead.id);

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

    // Build the dynamic system prompt
    const baseSystemPrompt = client.system_prompt || `You are an expert AI Lead Concierge for ${client.name}. Your objective is to help the user and encourage them to book a time.`;
    
    const systemPrompt = `${baseSystemPrompt}

### CONTEXT FOR THIS CONVERSATION:
- Prospect Name: ${lead.name || 'Friend'}
- Original Inquiry/Context: ${lead.context || 'They texted us directly'}

### CORE BEHAVIOR RULES:
1. BREVITY IS KING: People read texts on the move. Keep every single response under 160 characters (1-2 sentences maximum). Do not write blocks of text.
2. NATURAL & TONED-DOWN: Do not sound like a marketing bot.
3. BOOKING: Always use this exact link when offering to book: ${client.calendly_link || 'our booking calendar'}

### COMPLIANCE GUARDRAILS:
- If the user uses the words "STOP", "UNSUBSCRIBE", "REMOVE", or expresses anger/explicit disinterest, immediately reply with exactly: "Understood. You have been opted out." and append the tag [STATUS: OPT_OUT] to the end of your response for the backend to read.`;

    // 6. Get AI Response from Gemini
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
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
    // Use the client's specific credentials if available, otherwise fallback to master credentials
    const clientTwilio = twilio(
      client.twilio_account_sid || process.env.TWILIO_ACCOUNT_SID,
      client.twilio_auth_token || process.env.TWILIO_AUTH_TOKEN
    );

    await clientTwilio.messages.create({
      body: aiResponse,
      from: to,
      to: from
    });

    // 10. Update Lead Status and last_contacted_at
    const leadUpdates: any = { last_contacted_at: new Date().toISOString() };
    if (newStatus !== 'new' && lead.status !== newStatus) {
      leadUpdates.status = newStatus;
    }
    await supabase.from('leads').update(leadUpdates).eq('id', lead.id);

    return new NextResponse('OK', { status: 200 });

  } catch (error: unknown) {
    console.error('Webhook Error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
