'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2, Mail } from 'lucide-react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { loginWithGoogle, sendEmailOtp } from '@/lib/auth/verification'

type VerificationGateProps = {
  onVerified: (user: { id: string; email: string; provider?: string, user_metadata?: Record<string, string> }) => void
}

export default function VerificationGate({ onVerified }: VerificationGateProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState<'google' | 'email' | null>(null)
  const [linkSent, setLinkSent] = useState(false)

  useEffect(() => {
    const supabase = createBrowserSupabaseClient()

    supabase.auth.getSession() // dispara el exchange si hay code en la URL

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') &&
        session?.user
      ) {
        onVerified({
          id: session.user.id,
          email: session.user.email ?? '',
          provider: session.user.identities?.[0]?.provider ?? session.user.app_metadata?.provider,
          user_metadata: session.user.user_metadata as Record<string, string>,
        })
      }
    })



    return () => data.subscription.unsubscribe()
  }, [onVerified])

  const handleGoogle = async () => {
    setError('')
    setBusy('google')

    try {
      await loginWithGoogle()
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'No se pudo iniciar Google.')
      setBusy(null)
    }
  }

  const handleSendEmail = async () => {
    const trimmedEmail = email.trim().toLowerCase()

    if (!trimmedEmail) {
      setError('Ingresa un correo válido para continuar.')
      return
    }

    setError('')
    setBusy('email')

    try {
      const { error: sendError } = await sendEmailOtp(trimmedEmail)

      if (sendError) throw sendError

      setLinkSent(true)
      setStatus(`Link enviado a ${trimmedEmail}`)
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'No se pudo enviar el link de verificación.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <section
      id="verificacion"
      style={{
        padding: '5rem 2.5rem 2rem',
        background:
          'radial-gradient(circle at top left, rgba(74,151,154,0.14), transparent 34%), radial-gradient(circle at top right, rgba(213,99,86,0.14), transparent 30%), linear-gradient(180deg, #f7f5f1 0%, #ffffff 100%)',
      }}
    >
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gap: '1.5rem',
            gridTemplateColumns: '1fr',
            maxWidth: 520,
            margin: '0 auto',
            alignItems: 'stretch',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              borderRadius: 28,
              padding: '1.5rem',
              background: 'white',
              boxShadow: '0 18px 50px rgba(10,58,107,0.08)',
              border: '1px solid rgba(10,58,107,0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  background: 'rgba(74,151,154,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--teal)',
                }}
              >
                <Mail size={20} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--teal)' }}>
                  ¿Cómo quieres verificarte?
                </p>
                <h3 style={{ margin: '0.2rem 0 0', fontFamily: 'Syne, sans-serif', fontSize: '1.35rem', color: 'var(--navy)' }}>
                  Entra con Google o confirma tu correo
                </h3>
              </div>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={busy !== null}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.7rem',
                padding: '0.95rem 1rem',
                borderRadius: 16,
                border: 'none',
                background: 'var(--navy)',
                color: 'white',
                fontWeight: 700,
                cursor: busy ? 'wait' : 'pointer',
                opacity: busy && busy !== 'google' ? 0.7 : 1,
              }}
            >
              {busy === 'google'
                ? <Loader2 size={18} className="animate-spin" />
                : <span style={{ fontWeight: 800 }}>G</span>
              }
              Continuar con Google
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1rem 0' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(10,58,107,0.12)' }} />
              <span style={{ fontSize: '0.8rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>o</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(10,58,107,0.12)' }} />
            </div>

            {/* Email */}
            <div style={{ display: 'grid', gap: '0.85rem' }}>
              {!linkSent ? (
                <>
                  <label style={{ display: 'grid', gap: '0.45rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--navy)' }}>Ingresa tu correo</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError('') }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendEmail()}
                      placeholder="correo@ejemplo.com"
                      style={{
                        width: '100%',
                        padding: '0.9rem 1rem',
                        borderRadius: 14,
                        border: '1px solid rgba(10,58,107,0.14)',
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '0.95rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleSendEmail}
                    disabled={busy !== null}
                    style={{
                      width: '100%',
                      padding: '0.95rem 1rem',
                      borderRadius: 16,
                      border: 'none',
                      background: 'var(--teal)',
                      color: 'white',
                      fontWeight: 700,
                      cursor: busy ? 'wait' : 'pointer',
                      opacity: busy && busy !== 'email' ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    {busy === 'email'
                      ? <><Loader2 size={16} className="animate-spin" /> Enviando...</>
                      : 'Enviarme el link'
                    }
                  </button>
                </>
              ) : (
                /* Estado: link enviado */
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1.25rem',
                    borderRadius: 16,
                    background: 'rgba(74,151,154,0.08)',
                    textAlign: 'center',
                  }}
                >
                  <CheckCircle2 size={32} style={{ color: 'var(--teal)' }} />
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: 'var(--navy)' }}>Revisa tu correo</p>
                    <p style={{ margin: '0.3rem 0 0', fontSize: '0.875rem', color: '#6B7280' }}>
                      Enviamos un link a <strong>{email}</strong>.<br />
                      Haz click en el link para ingresar.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setLinkSent(false); setStatus(''); setEmail('') }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--teal)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      textDecoration: 'underline',
                    }}
                  >
                    Usar otro correo
                  </button>
                </div>
              )}

              {error && (
                <div
                  style={{
                    padding: '0.95rem 1rem',
                    borderRadius: 16,
                    background: 'rgba(211,99,86,0.08)',
                    color: 'var(--coral)',
                    lineHeight: 1.55,
                    fontSize: '0.875rem',
                  }}
                >
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}