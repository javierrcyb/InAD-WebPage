// lib/security/origin-check.ts
import { NextRequest, NextResponse } from 'next/server'

export function checkOrigin(req: NextRequest): NextResponse | null {
  const origin = req.headers.get('origin')
  const allowedOrigin = process.env.NEXT_PUBLIC_SITE_URL

  const referer = req.headers.get('referer')

  if (!origin && !referer) {

    return NextResponse.json({ error: 'Origen no verificable' }, { status: 403 })
  }

  const sourceOrigin = origin ?? new URL(referer!).origin

  if (sourceOrigin !== allowedOrigin) {
    return NextResponse.json({ error: 'Origen no permitido' }, { status: 403 })
  }

  return null 
}