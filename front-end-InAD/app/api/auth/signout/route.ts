 // app/api/auth/signout/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { checkOrigin } from '@/lib/security/originCheck'


export async function POST(req: NextRequest) {
  const originError = checkOrigin(req)
  if (originError) return originError

  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  return NextResponse.json({ success: true })
}