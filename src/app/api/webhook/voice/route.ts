import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  try {
    const text = await req.text();
    const params = new URLSearchParams(text);
    const to = params.get('To');
    const from = params.get('From');

    if (!to) {
      return new NextResponse('Missing To parameter', { status: 400 });
    }

    // Lookup Client
    const { data: client } = await supabase
      .from('clients')
      .select('id, name')
      .eq('twilio_number', to)
      .single();

    const greeting = client 
      ? `Hi there! Thanks for calling ${client.name}. How can I help you today?` 
      : 'Hello! How can I help you today?';

    // Return TwiML
    const twiml = `
      <Response>
        <Say voice="Polly.Joanna-Neural">${greeting}</Say>
        <Gather input="speech" action="/api/webhook/voice/gather" speechTimeout="auto">
        </Gather>
      </Response>
    `;

    return new NextResponse(twiml, { 
      status: 200, 
      headers: { 'Content-Type': 'text/xml' } 
    });

  } catch (err) {
    console.error('Voice Webhook Error:', err);
    return new NextResponse(
      `<Response><Say>Sorry, an error occurred.</Say></Response>`, 
      { status: 200, headers: { 'Content-Type': 'text/xml' } }
    );
  }
}
