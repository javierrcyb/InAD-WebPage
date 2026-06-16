'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { loginWithGoogle, sendEmailOtp, verifyEmailOtp } from '@/lib/auth/verification'

type VerificationGateProps = {
  onVerified: (user: { id: string; email: string; provider?: string }) => void
}

type Step = 'email' | 'token'

export default function VerificationGate({ onVerified }: VerificationGateProps) {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [step, setStep] = useState<Step>('email')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState<'google' | 'email' | 'token' | null>(null)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const supabase = createBrowserSupabaseClient()
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      // Solo reaccionar a login nuevo, no a sesión restaurada
      if (
        (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') &&
        session?.user
      ) {
        const provider = session.user.app_metadata?.provider
        setUserEmail(session.user.email ?? '')
        onVerified({
          id: session.user.id,
          email: session.user.email ?? '',
          provider,
        })
      }
    })

    return () => {
      data.subscription.unsubscribe()
    }
  }, [onVerified])

  const handleGoogle = async () => {
    setError('')
    setStatus('Abriendo Google para completar la verificación.')
    setBusy('google')

    try {
      await loginWithGoogle()
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'No se pudo iniciar Google.')
      setStatus('')
      setBusy(null)
    }
  }

  const handleSendEmail = async () => {
    const trimmedEmail = email.trim().toLowerCase() // Verificar email valido

    if (!trimmedEmail) {
      setError('Ingresa un correo válido para continuar.')
      return
    }

    setError('')
    setStatus('Enviando el código al correo ingresado.')
    setBusy('email')

    try {
      const { error: sendError } = await sendEmailOtp(trimmedEmail)

      if (sendError) {
        throw sendError
      }

      setStep('token')
      setStatus('Revisa tu correo y pega el código de 6 dígitos.')
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'No se pudo enviar el código.')
      setStatus('')
    } finally {
      setBusy(null)
    }
  }

  const handleVerifyToken = async () => {
    const trimmedEmail = email.trim().toLowerCase()
    const trimmedToken = token.trim()

    if (!trimmedEmail || !trimmedToken) {
      setError('Completa correo y código antes de verificar.')
      return
    }

    setError('')
    setStatus('Verificando el código.')
    setBusy('token')

    try {
      const { error: verifyError } = await verifyEmailOtp(trimmedEmail, trimmedToken)

      if (verifyError) {
        throw verifyError
      }

      const { data } = await createBrowserSupabaseClient().auth.getUser()

      if (!data.user) {
        throw new Error('No se pudo confirmar la sesión autenticada.')
      }

      setUserEmail(data.user.email ?? trimmedEmail)
      setStatus('Correo verificado correctamente.')
      onVerified({ id: data.user.id, email: data.user.email ?? trimmedEmail, provider: data.user.app_metadata?.provider })
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'No se pudo verificar el código.')
      setStatus('')
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
            justifyContent: 'center'
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
              {busy === 'google' ? <Loader2 size={18} className="animate-spin" /> : <span style={{ fontWeight: 800 }}>G</span>}
              Continuar con Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1rem 0' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(10,58,107,0.12)' }} />
              <span style={{ fontSize: '0.8rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>o</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(10,58,107,0.12)' }} />
            </div>

            <div style={{ display: 'grid', gap: '0.85rem' }}>
              <label style={{ display: 'grid', gap: '0.45rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--navy)' }}>Ingresa tu correo</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="correo@ejemplo.com"
                    style={{
                      width: '100%',
                      padding: '0.9rem 1rem',
                      borderRadius: 14,
                      border: '1px solid rgba(10,58,107,0.14)',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />

                  {step === 'token' && (
                    <input
                      type="text"
                      value={token}
                      onChange={(event) => setToken(event.target.value)}
                      placeholder="Código de 6 dígitos"
                      inputMode="numeric"
                      style={{
                        width: '100%',
                        padding: '0.9rem 1rem',
                        borderRadius: 14,
                        border: '1px solid rgba(10,58,107,0.14)',
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '0.95rem',
                        outline: 'none',
                        letterSpacing: '0.22em',
                      }}
                    />
                  )}
                </div>
              </label>

              {step === 'email' ? (
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
                  }}
                >
                  {busy === 'email' ? 'Enviando...' : 'Enviarme el código'}
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    disabled={busy !== null}
                    style={{
                      flex: 0.9,
                      padding: '0.95rem 1rem',
                      borderRadius: 16,
                      border: '1px solid rgba(10,58,107,0.16)',
                      background: 'white',
                      color: 'var(--navy)',
                      fontWeight: 700,
                      cursor: busy ? 'wait' : 'pointer',
                    }}
                  >
                    Cambiar correo
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyToken}
                    disabled={busy !== null}
                    style={{
                      flex: 1.1,
                      padding: '0.95rem 1rem',
                      borderRadius: 16,
                      border: 'none',
                      background: 'var(--navy)',
                      color: 'white',
                      fontWeight: 700,
                      cursor: busy ? 'wait' : 'pointer',
                    }}
                  >
                    {busy === 'token' ? 'Verificando...' : 'Validar código'}
                  </button>
                </div>
              )}

              {status && (
                <div
                  style={{
                    display: 'flex',
                    gap: '0.65rem',
                    alignItems: 'flex-start',
                    padding: '0.95rem 1rem',
                    borderRadius: 16,
                    background: 'rgba(74,151,154,0.08)',
                    color: 'var(--navy)',
                    lineHeight: 1.55,
                  }}
                >
                  <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{status}</span>
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
                  }}
                >
                  {error}
                </div>
              )}

              {userEmail && (
                <div
                  style={{
                    padding: '0.95rem 1rem',
                    borderRadius: 16,
                    background: 'rgba(245,130,49,0.08)',
                    color: 'var(--navy)',
                    lineHeight: 1.55,
                  }}
                >
                  Sesión detectada: <strong>{userEmail}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}