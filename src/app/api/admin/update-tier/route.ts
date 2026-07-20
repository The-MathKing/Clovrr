import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const { clientId, tier } = await req.json();

    if (!clientId || !tier) {
      return NextResponse.json({ error: 'Client ID and Tier are required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin
    const { data: adminClient } = await supabase
      .from('clients')
      .select('is_admin')
      .eq('email', user.email)
      .single();

    if (!adminClient?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update the tier
    const { error: updateError } = await supabase
      .from('clients')
      .update({ tier })
      .eq('id', clientId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Admin Update API Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
