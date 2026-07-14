// lib/auth/verification.ts

export function loginWithGoogle() {
  // Server-side redirect completo — no hay llamada a Supabase desde el cliente
  window.location.href = '/api/auth/google'
}

export async function sendEmailOtp(email: string) {
  const res = await fetch('/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  const data = await res.json()

  if (!res.ok) {
    return { error: new Error(data.error) }
  }

  return { error: null }
}

export async function getCurrentUser() {
  const res = await fetch('/api/auth/session')
  const data = await res.json()
  return data.user as { id: string; email: string; provider?: string; user_metadata?: Record<string, string> } | null
}

export async function signOut() {
  await fetch('/api/auth/signout', { method: 'POST' })
}