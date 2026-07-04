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
      const prompt = `You are the AI assistant for ${client.name}. Write a short, friendly, and highly engaging opening message to reactivate an old lead.
Lead Name: ${lead.name || 'Friend'}
Context about them: ${lead.context || 'They previously inquired about our services.'}
Keep it strictly under 160 characters. Do not include placeholders or signatures. Be conversational, natural, and ask a question to restart the dialogue.`;

      const result = await model.generateContent(prompt);
      const message = result.response.text().trim();

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

        sentCount++;
      }
    }

    return NextResponse.json({ success: true, count: sentCount });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
