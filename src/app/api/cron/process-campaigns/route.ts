import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';
import sgMail from '@sendgrid/mail';

// This is a cron job route, we use the Service Role Key to bypass RLS
export async function GET(req: Request) {
  // Check authorization (Vercel Cron automatically sends a secret header we could check, 
  // but for MVP we might just rely on obscured URL or service role key if triggered externally).
  // Ideally: if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) ...
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  try {
    // 1. Find all active campaigns
    const { data: campaigns, error: campError } = await supabase
      .from('campaigns')
      .select('id, client_id, initial_message')
      .eq('status', 'active');

    if (campError) throw campError;
    if (!campaigns || campaigns.length === 0) {
      return NextResponse.json({ message: 'No active campaigns' }, { status: 200 });
    }

    let processedCount = 0;

    // Process each active campaign
    for (const campaign of campaigns) {
      // Fetch client details for Twilio credentials
      const { data: client } = await supabase
        .from('clients')
        .select('twilio_number, twilio_account_sid, twilio_auth_token, sendgrid_api_key, sendgrid_from_email')
        .eq('id', campaign.client_id)
        .single();

      if (!client) continue;

      const clientTwilio = twilio(
        client.twilio_account_sid || process.env.TWILIO_ACCOUNT_SID,
        client.twilio_auth_token || process.env.TWILIO_AUTH_TOKEN
      );

      // Fetch up to 50 leads for this campaign that haven't been contacted yet
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('id, contact_id, email, name, context, last_inbound_date')
        .eq('campaign_id', campaign.id)
        .is('last_contacted_at', null)
        .limit(50);

      if (leadsError) continue;

      if (!leads || leads.length === 0) {
        // If no more leads to contact, mark campaign as completed
        await supabase.from('campaigns').update({ status: 'completed' }).eq('id', campaign.id);
        continue;
      }

      // Send messages
      for (const lead of leads) {
        try {
          // Replace {name} placeholder if exists
          let messageBody = campaign.initial_message;
          if (lead.name) {
             messageBody = messageBody.replace(/{name}/gi, lead.name);
          } else {
             messageBody = messageBody.replace(/{name}/gi, 'there');
          }
          
          if (lead.context) {
             // In real app, we might use AI to rewrite the initial message with context.
             // For now, it's just raw template replacement.
          }

          // Send Email if available
          if (lead.email && client.sendgrid_api_key && client.sendgrid_from_email) {
            sgMail.setApiKey(client.sendgrid_api_key);
            await sgMail.send({
              to: lead.email,
              from: client.sendgrid_from_email,
              subject: `Checking in - ${client.name}`,
              text: messageBody
            });
          }
          
          // Send SMS if available
          if (lead.contact_id && !lead.contact_id.includes('@') && client.twilio_number) {
            await clientTwilio.messages.create({
              body: messageBody,
              from: client.twilio_number,
              to: lead.contact_id
            });
          }

          // Update lead status and save to conversations
          await supabase.from('leads').update({
            last_contacted_at: new Date().toISOString()
          }).eq('id', lead.id);

          await supabase.from('conversations').insert({
            lead_id: lead.id,
            role: 'assistant',
            content: messageBody
          });

          processedCount++;
        } catch (err) {
          console.error(`Failed to send campaign message to lead ${lead.id}:`, err);
        }
      }
    }

    return NextResponse.json({ message: `Processed ${processedCount} leads.` }, { status: 200 });

  } catch (error: any) {
    console.error('Process campaigns error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
