// app/api/auth/google/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url)
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: { prompt: 'select_account' },
      skipBrowserRedirect: true, // 👈 clave: nos da la URL, no redirige él mismo
    },
  })

  if (error || !data.url) {
    return NextResponse.redirect(`${origin}/#verificacion?error=google`)
  }

  return NextResponse.redirect(data.url)
}