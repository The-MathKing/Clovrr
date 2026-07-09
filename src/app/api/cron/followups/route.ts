import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

  try {
    // We want to find leads who:
    // - are not booked or disqualified
    // - haven't responded since we last contacted them (last_replied_at < last_contacted_at or last_replied_at IS NULL AND last_contacted_at is NOT NULL)
    // - last_contacted_at was more than 24 hours ago
    // - followup_count is less than 6
    
    // We'll use a direct raw query via Supabase RPC or just fetch a broad set and filter.
    // For MVP, filtering a smaller set directly:
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('id, client_id, phone_number, name, status, context, last_contacted_at, last_replied_at, followup_count')
      .in('status', ['new', 'qualified'])
      .lt('followup_count', 6)
      .not('last_contacted_at', 'is', null);

    if (leadsError) throw leadsError;

    if (!leads || leads.length === 0) {
      return NextResponse.json({ message: 'No leads require follow-up.' }, { status: 200 });
    }

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Filter locally to handle date logic easily
    const leadsToFollowUp = leads.filter(lead => {
      const lastContacted = new Date(lead.last_contacted_at);
      
      // Must be older than 24 hours
      if (lastContacted > twentyFourHoursAgo) return false;
      
      if (!lead.last_replied_at) return true; // They never replied, but we contacted them

      const lastReplied = new Date(lead.last_replied_at);
      // We were the last ones to speak
      return lastReplied < lastContacted;
    });

    if (leadsToFollowUp.length === 0) {
      return NextResponse.json({ message: 'No leads ready for follow-up yet.' }, { status: 200 });
    }

    let followUpCount = 0;

    for (const lead of leadsToFollowUp) {
      const { data: client } = await supabase
        .from('clients')
        .select('name, calendly_link, system_prompt, twilio_account_sid, twilio_auth_token, twilio_number')
        .eq('id', lead.client_id)
        .single();

      if (!client || !client.twilio_number) continue;

      // Fetch Conversation History
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

      // Generate Follow-up
      const currentFollowupNumber = (lead.followup_count || 0) + 1;
      
      const systemPrompt = `You are the AI Concierge for ${client.name}.
The user has not responded to our last message. This is automated follow-up attempt #${currentFollowupNumber}.
Your goal is to send a VERY SHORT, polite, and casual text to bump the conversation and see if they are still interested. 
Do not be pushy. If it's a high follow-up number, ask if they want us to close their file.
Booking link: ${client.calendly_link || ''}

CRITICAL RULES:
- Under 120 characters. 1 sentence ideally.
- Do not sound like a robot.
- Context of prospect: ${lead.context || 'general inquiry'}`;

      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        systemInstruction: systemPrompt 
      });

      try {
        const result = await model.generateContent({ contents });
        const aiResponse = result.response.text().trim();

        // Send via Twilio
        const clientTwilio = twilio(
          client.twilio_account_sid || process.env.TWILIO_ACCOUNT_SID,
          client.twilio_auth_token || process.env.TWILIO_AUTH_TOKEN
        );

        await clientTwilio.messages.create({
          body: aiResponse,
          from: client.twilio_number,
          to: lead.phone_number
        });

        // Save and Update
        await supabase.from('conversations').insert({
          lead_id: lead.id,
          role: 'assistant',
          content: aiResponse
        });

        await supabase.from('leads').update({
          last_contacted_at: new Date().toISOString(),
          followup_count: currentFollowupNumber
        }).eq('id', lead.id);

        followUpCount++;
      } catch (err) {
        console.error(`Failed to follow up with ${lead.phone_number}:`, err);
      }
    }

    return NextResponse.json({ message: `Sent ${followUpCount} follow-ups.` }, { status: 200 });

  } catch (error: any) {
    console.error('Followups cron error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
