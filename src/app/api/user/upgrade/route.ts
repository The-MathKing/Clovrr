import { NextResponse } from 'next/server';
import { createClient as createSupabaseServerClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

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

    // 2. Initialize the admin client to update user metadata
    const adminSupabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    // 3. Update the user's tier in their metadata
    // We preserve existing metadata and just update/add the tier
    const { error: updateError } = await adminSupabase.auth.admin.updateUserById(
      user.id,
      { user_metadata: { ...user.user_metadata, tier } }
    );

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
