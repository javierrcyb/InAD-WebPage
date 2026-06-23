// app/auth/callback/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/#verificacion`)
  }

  // Pasa el code al cliente para que Supabase complete el PKCE exchange
  return NextResponse.redirect(`${origin}/?code=${code}#verificacion`)
}