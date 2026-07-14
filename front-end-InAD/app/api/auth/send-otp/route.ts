// app/api/auth/send-otp/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'  
import { isDisposableEmail } from '@/lib/auth/disposable-check'
import { checkOrigin } from '@/lib/security/originCheck'

export async function POST(req: NextRequest) {
  const originError = checkOrigin(req)
  if (originError) return originError
  
  const { email } = await req.json()

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Correo inválido.' }, { status: 400 })
  }

  const trimmedEmail = email.trim().toLowerCase()

  if (await isDisposableEmail(trimmedEmail)) {
    return NextResponse.json(
      { error: 'No se permiten correos temporales. Usa un correo permanente.' },
      { status: 400 }
    )
  }

  const supabase = await createServerSupabaseClient() 

  const { error } = await supabase.auth.signInWithOtp({
    email: trimmedEmail,
    options: { shouldCreateUser: true },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}