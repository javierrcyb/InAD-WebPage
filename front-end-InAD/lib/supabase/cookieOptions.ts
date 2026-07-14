// lib/supabase/cookieOptions.ts
import type { CookieOptions } from '@supabase/ssr'

export function secureCookieOptions(options: CookieOptions = {}): CookieOptions {
  return {
    ...options,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  }
}