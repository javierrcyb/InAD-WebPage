'use client'

import { useState } from 'react'
import { LockKeyhole } from 'lucide-react'
import VerificationGate from '@/components/auth/VerificationGate'
import FormBlock from './FormBlock'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

type VerifiedUser = {
  id: string
  email: string
  provider?: string,
  user_metadata?: Record<string, string>
}

export default function EvaluationFlow() {
  const [verifiedUser, setVerifiedUser] = useState<VerifiedUser | null>(null)

  console.log('EvaluationFlow render — verifiedUser:', verifiedUser) 

  const handleSignOut = async () => {
    const supabase = createBrowserSupabaseClient()
    await supabase.auth.signOut()
    setVerifiedUser(null)
  }

  return (
  <>
    {!verifiedUser && (
      <VerificationGate onVerified={setVerifiedUser} />
    )}

    {!verifiedUser ? (
      <section
        id="evaluacion"
        style={{
          padding: '0 2.5rem 5rem',
          background: 'linear-gradient(180deg, #ffffff 0%, #f7f5f1 100%)',
        }}
      >
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div
            style={{
              padding: '1.25rem 1.4rem',
              borderRadius: 20,
              background: 'rgba(10,58,107,0.05)',
              border: '1px solid rgba(10,58,107,0.08)',
              color: 'var(--navy)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 16px rgba(10,58,107,0.08)',
              }}
            >
              <LockKeyhole size={18} />
            </div>
            <div>
              <strong style={{ display: 'block', marginBottom: '0.15rem' }}>El formulario se desbloquea después de verificarte.</strong>
              <span style={{ color: '#6B7280' }}>Primero confirma tu correo o entra con Google. Luego podrás responder la encuesta.</span>
            </div>
          </div>
        </div>
      </section>
    ) : (
      <FormBlock verifiedUser={verifiedUser} onSignOut={handleSignOut} />
    )}
  </>
)
}