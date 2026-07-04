import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import twilio from 'twilio';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: client } = await supabase.from('clients').select('*').eq('email', user.email).single();
    if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

    // Fetch uncontacted leads
    const { data: leads } = await supabase
      .from('leads')
      .select('*, conversations(id)')
      .eq('client_id', client.id)
      .eq('status', 'new');

    const uncontactedLeads = (leads || []).filter((l: any) => !l.conversations || l.conversations.length === 0);

    if (uncontactedLeads.length === 0) {
      return NextResponse.json({ success: true, count: 0, message: 'No uncontacted leads found' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID || 'placeholder', 
      process.env.TWILIO_AUTH_TOKEN || 'placeholder'
    );

    let sentCount = 0;

    for (const lead of uncontactedLeads) {
      // 1. Generate Custom Message
      const systemPrompt = `You are an expert AI Lead Concierge named Clovrr, acting on behalf of ${client.name}, an independent insurance agency. Your sole objective is to re-engage past prospects who requested a quote but stalled out, or existing single-policy clients who qualify for a bundle discount.

### CONTEXT FOR THIS CONVERSATION:
- Prospect Name: ${lead.name || 'Friend'}
- Campaign Type: Reactivation Blast
- Original Inquiry/Policy: ${lead.context || 'They previously inquired about our services.'}

### CORE BEHAVIOR RULES:
1. BREVITY IS KING: People read texts and quick emails on the move. Keep every single response under 160 characters (1-2 sentences maximum). Do not write blocks of text.
2. NATURAL & TONED-DOWN: Do not sound like a marketing bot. Write like a busy but helpful account manager. Use lowercase naturally if texting.
3. STRICT PERSISTENCE: If the prospect is vague, gently guide them back to booking a time. 
4. NO INVENTING POLICY DETAILS: Never quote exact premiums or coverage numbers unless explicitly provided in the context data.

### CONVERSATIONAL FLOW:
- Step 1 (Opening): Acknowledge the context immediately. Ask a direct, low-friction question to spark the conversation. (This is the message you are generating right now).

### COMPLIANCE GUARDRAILS:
- If the user uses the words "STOP", "UNSUBSCRIBE", "REMOVE", immediately reply with exactly: "Understood. You have been opted out." and append the tag [STATUS: OPT_OUT] to the end of your response for the backend to read.`;

      const prompt = `Write the very first opening SMS to reactivate this lead based on the rules. Do not include placeholders or signatures. Be conversational, natural, and ask a question to restart the dialogue.`;

      const modelWithInstruction = genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro",
        systemInstruction: systemPrompt 
      });
      const result = await modelWithInstruction.generateContent(prompt);
      let message = result.response.text().trim();

      let newStatus = lead.status;
      if (message.includes('[STATUS: OPT_OUT]')) {
        newStatus = 'disqualified';
        message = message.replace('[STATUS: OPT_OUT]', '').trim();
      }

      // 2. Send via appropriate channel
      if (lead.channel === 'sms' && client.twilio_number && process.env.TWILIO_ACCOUNT_SID) {
        await twilioClient.messages.create({
          body: message,
          from: client.twilio_number,
          to: lead.contact_id
        });

        // 3. Log conversation
        await supabase.from('conversations').insert({
          lead_id: lead.id,
          role: 'assistant',
          content: message
        });

        if (newStatus !== lead.status) {
          await supabase.from('leads').update({ status: newStatus }).eq('id', lead.id);
        }

        sentCount++;
      }
    }

    return NextResponse.json({ success: true, count: sentCount });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
