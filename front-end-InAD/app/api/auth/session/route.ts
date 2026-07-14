// app/api/auth/session/route.ts
import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ user: null }, { status: 200 })
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email ?? '',
      provider: user.identities?.[0]?.provider ?? user.app_metadata?.provider,
      user_metadata: user.user_metadata,
    },
  })
}