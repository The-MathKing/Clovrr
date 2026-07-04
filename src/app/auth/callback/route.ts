import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Create or update client record on successful Google login
      const { data: { user } } = await supabase.auth.getUser()
      if (user && user.email) {
        // Upsert into clients table
        await supabase.from('clients').upsert({
          email: user.email,
          name: user.user_metadata?.full_name || 'New Agency',
        }, { onConflict: 'email' })
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?message=Could not authenticate with Google`)
}
