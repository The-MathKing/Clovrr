import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import sgMail from '@sendgrid/mail';
import { syncLeadToCRMs } from '@/utils/crm';

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

  try {
    const formData = await req.formData();
    // SendGrid sends 'from', 'to', 'subject', 'text', 'html'
    const fromField = formData.get('from') as string;
    const toField = formData.get('to') as string;
    const bodyText = formData.get('text') as string;
    const subject = formData.get('subject') as string;

    if (!fromField || !toField || !bodyText) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Extract email from "Name <email@domain.com>" format
    const extractEmail = (str: string) => {
      const match = str.match(/<([^>]+)>/);
      return match ? match[1].toLowerCase().trim() : str.toLowerCase().trim();
    };

    const fromEmail = extractEmail(fromField);
    const toEmail = extractEmail(toField);

    // Find the client using the receiving email
    const { data: client } = await supabase
      .from('clients')
      .select('id, name, calendly_link, system_prompt, sendgrid_api_key, sendgrid_from_email, ghl_api_key, ghl_location_id, hubspot_access_token')
      .eq('sendgrid_from_email', toEmail)
      .single();

    if (!client) {
      console.error('Client not found for receiving email:', toEmail);
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Find lead by email
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id, status, name, context')
      .eq('email', fromEmail)
      .eq('client_id', client.id)
      .single();

    let lead = existingLead;

    if (!lead) {
      // Create new lead from inbound email
      const { data: newLead, error: insertError } = await supabase
        .from('leads')
        .insert({
          client_id: client.id,
          email: fromEmail,
          contact_id: fromEmail, // Use email as contact_id fallback
          channel: 'email',
          last_inbound_date: new Date().toISOString()
        })
        .select('id, status, name, context')
        .single();
        
      if (insertError) throw insertError;
      lead = newLead;
    } else {
      // Update last_replied_at
      await supabase.from('leads').update({
        last_replied_at: new Date().toISOString(),
        followup_count: 0
      }).eq('id', lead.id);
    }

    if (!lead) throw new Error('Failed to find or create lead');

    // Save incoming message
    await supabase.from('conversations').insert({
      lead_id: lead.id,
      role: 'user',
      content: `Subject: ${subject}\n\n${bodyText}`
    });

    // Fetch history
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
- Prospect Name: ${lead.name || 'Friend'}
- Original Inquiry/Context: ${lead.context || 'Email Inquiry'}

### CORE BEHAVIOR RULES (EMAIL):
1. Keep the email concise and professional but conversational.
2. Do not sound like a marketing bot.
3. BOOKING: Always use this exact link when offering to book: ${client.calendly_link || 'our booking calendar'}

### COMPLIANCE GUARDRAILS:
- If the user uses the words "STOP", "UNSUBSCRIBE", "REMOVE", or expresses anger/explicit disinterest, immediately reply with exactly: "Understood. You have been opted out." and append the tag [STATUS: OPT_OUT] to the end of your response for the backend to read.`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt 
    });

    const result = await model.generateContent({ contents });
    let aiResponse = result.response.text().trim();

    let newStatus = 'new';
    if (aiResponse.includes('[STATUS: OPT_OUT]')) {
      newStatus = 'disqualified';
      aiResponse = aiResponse.replace('[STATUS: OPT_OUT]', '').trim();
    } else if (aiResponse.includes(client.calendly_link || 'calendly')) {
      newStatus = 'qualified';
    }

    // Save AI response
    await supabase.from('conversations').insert({
      lead_id: lead.id,
      role: 'assistant',
      content: aiResponse
    });

    // Send email response via SendGrid
    sgMail.setApiKey(client.sendgrid_api_key || process.env.SENDGRID_API_KEY || '');
    
    const msg = {
      to: fromEmail,
      from: toEmail,
      subject: `Re: ${subject}`,
      text: aiResponse,
    };
    
    await sgMail.send(msg);

    // Update Lead Status and last_contacted_at
    const leadUpdates: any = { last_contacted_at: new Date().toISOString() };
    if (newStatus !== 'new' && lead.status !== newStatus) {
      leadUpdates.status = newStatus;
    }
    await supabase.from('leads').update(leadUpdates).eq('id', lead.id);

    await syncLeadToCRMs(client, lead, newStatus === 'qualified' || newStatus === 'booked');

    return new NextResponse('OK', { status: 200 });
  } catch (error: any) {
    console.error('SendGrid Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
