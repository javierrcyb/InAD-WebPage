import { createBrowserSupabaseClient } from '@/lib/supabase/client'

function getRedirectTo() {
  if (typeof window === 'undefined') return undefined
  return `${window.location.origin}/auth/callback`
}

export async function loginWithGoogle() {
  const supabase = createBrowserSupabaseClient()

  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: getRedirectTo(),
    },
  })
}

export async function sendEmailOtp(email: string) {
  const supabase = createBrowserSupabaseClient()

  return supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true
    },
  })
}

export async function verifyEmailOtp(email: string, token: string) {
  const supabase = createBrowserSupabaseClient()

  return supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })
}