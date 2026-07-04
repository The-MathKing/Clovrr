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
    const updates: Record<string, string> = {};
    if (body.twilio_account_sid !== undefined) updates.twilio_account_sid = body.twilio_account_sid;
    if (body.twilio_auth_token !== undefined) updates.twilio_auth_token = body.twilio_auth_token;
    if (body.sendgrid_api_key !== undefined) updates.sendgrid_api_key = body.sendgrid_api_key;
    if (body.twilio_number !== undefined) updates.twilio_number = body.twilio_number;

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
