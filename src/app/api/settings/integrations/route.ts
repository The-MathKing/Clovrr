import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Validate inputs
    const updates: Record<string, any> = {};
    if (body.twilio_account_sid !== undefined) updates.twilio_account_sid = body.twilio_account_sid;
    if (body.twilio_auth_token !== undefined) updates.twilio_auth_token = body.twilio_auth_token;
    if (body.sendgrid_api_key !== undefined) updates.sendgrid_api_key = body.sendgrid_api_key;
    if (body.sendgrid_from_email !== undefined) updates.sendgrid_from_email = body.sendgrid_from_email;
    if (body.avg_policy_value !== undefined) updates.avg_policy_value = body.avg_policy_value;
    if (body.twilio_number !== undefined) updates.twilio_number = body.twilio_number;
    if (body.ghl_api_key !== undefined) updates.ghl_api_key = body.ghl_api_key;
    if (body.ghl_location_id !== undefined) updates.ghl_location_id = body.ghl_location_id;
    if (body.hubspot_access_token !== undefined) updates.hubspot_access_token = body.hubspot_access_token;

    if (Object.keys(updates).length > 0) {
      await supabase
        .from('clients')
        .update(updates)
        .eq('email', user.email);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Integration update error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
