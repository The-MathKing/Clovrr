import { NextResponse } from 'next/server';
import { createClient as createSupabaseServerClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const { tier } = await req.json();

    if (!tier) {
      return NextResponse.json({ error: 'Tier is required' }, { status: 400 });
    }

    // 1. Get the authenticated user making the request
    const supabaseServer = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Update the user's tier in their metadata using their own session!
    // No Service Role Key required because users are allowed to update their own user_metadata.
    const { error: updateError } = await supabaseServer.auth.updateUser({
      data: { tier }
    });

    if (updateError) {
      console.error('Failed to update user tier:', updateError);
      return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
    }

    return NextResponse.json({ success: true, tier });
  } catch (err: any) {
    console.error('Upgrade API Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
