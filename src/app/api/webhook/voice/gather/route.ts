import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

  try {
    const text = await req.text();
    const params = new URLSearchParams(text);
    
    const to = params.get('To');
    const from = params.get('From');
    const speechResult = params.get('SpeechResult'); // Twilio's transcription

    if (!to || !from || !speechResult) {
      // If no speech, just prompt them again
      const twiml = `
        <Response>
          <Gather input="speech" action="/api/webhook/voice/gather" speechTimeout="auto">
            <Say voice="Polly.Joanna-Neural">Are you still there?</Say>
          </Gather>
        </Response>
      `;
      return new NextResponse(twiml, { status: 200, headers: { 'Content-Type': 'text/xml' } });
    }

    // Lookup Client
    const { data: client } = await supabase
      .from('clients')
      .select('*')
      .eq('twilio_number', to)
      .single();

    if (!client) {
      return new NextResponse('<Response><Say>Account not found.</Say></Response>', { status: 200, headers: { 'Content-Type': 'text/xml' } });
    }

    // Lookup or Create Lead
    let { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('contact_id', from)
      .eq('client_id', client.id)
      .single();

    if (!lead) {
      const { data: newLead } = await supabase
        .from('leads')
        .insert({ client_id: client.id, contact_id: from, channel: 'voice' })
        .select('*')
        .single();
      lead = newLead;
    }

    // Save User Audio Transcript
    await supabase.from('conversations').insert({ lead_id: lead.id, role: 'user', content: speechResult });

    // Fetch History
    const { data: history } = await supabase
      .from('conversations')
      .select('role, content')
      .eq('lead_id', lead.id)
      .order('created_at', { ascending: false })
      .limit(6); // Keep it short for voice

    const contents = (history || []).reverse().map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const baseSystemPrompt = client.system_prompt || `You are an expert AI Lead Concierge for ${client.name}. Your objective is to help the user and encourage them to book a time.`;
    const systemPrompt = `${baseSystemPrompt}
### CONTEXT FOR THIS CONVERSATION:
- You are talking on a LIVE PHONE CALL with the prospect.
- DO NOT format your text with markdown, asterisks, or URLs. Speak purely in natural conversational words.
- Keep your answers extremely short (1-2 sentences max).
- If they want to book, tell them you will text them the booking link right after the call.`;

    // Query Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', systemInstruction: systemPrompt });
    const result = await model.generateContent({ contents });
    let aiResponse = result.response.text().trim();

    // Save AI Response
    await supabase.from('conversations').insert({ lead_id: lead.id, role: 'assistant', content: aiResponse });

    // Return TwiML with the AI's spoken response
    const twiml = `
      <Response>
        <Say voice="Polly.Joanna-Neural">${aiResponse}</Say>
        <Gather input="speech" action="/api/webhook/voice/gather" speechTimeout="auto">
        </Gather>
      </Response>
    `;

    return new NextResponse(twiml, { status: 200, headers: { 'Content-Type': 'text/xml' } });

  } catch (err) {
    console.error('Voice Gather Error:', err);
    const twiml = `
      <Response>
        <Say voice="Polly.Joanna-Neural">I'm sorry, I'm having trouble thinking right now.</Say>
      </Response>
    `;
    return new NextResponse(twiml, { status: 200, headers: { 'Content-Type': 'text/xml' } });
  }
}
