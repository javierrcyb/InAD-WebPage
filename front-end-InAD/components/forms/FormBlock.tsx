'use client'

import { useEffect, useState } from 'react'
import { FormData, INITIAL_FORM } from '@/types'
import Step0Form from './steps/Step0Form'
import Step1Form from './steps/Step1Form'
import Step2Form from './steps/Step2Form'
import Step3Form from './steps/Step3Form'
import Step4Form from './steps/Step4Form'
import Step5Form from './steps/Step5Form'
import Step6Form from './steps/Step6Form'
import ResultadoBlock from './ResultadoBlock'
import { stepSchemas } from '@/lib/validations/form'
import { completeFormResponse, getFormResponse, saveFormDraft } from '@/lib/api/responses'
import { calcularINAD, ResultadoINAD } from '@/lib/calculations/InAdCalculation'
import { Loader2 } from 'lucide-react'

type VerifiedUser = {
    id: string
    email: string
    provider?: string
    user_metadata?: Record<string, string>
}

type FormBlockProps = {
    verifiedUser: VerifiedUser
    onSignOut: () => Promise<void>
}

const STEPS = [
    'Bienvenida',
    'Perfil personal',
    'Educación e ingresos',
    'Ubicación',
    'Actividades digitales',
    'Inteligencia Artificial',
    'Ciberespacio',
]

function mergeFormData(source: Partial<FormData> | null | undefined): FormData {
    return {
        ...INITIAL_FORM,
        ...source,
        p316: { ...INITIAL_FORM.p316, ...(source?.p316 ?? {}) },
        preguntasIA: { ...INITIAL_FORM.preguntasIA, ...(source?.preguntasIA ?? {}) },
        preguntasCiberespacio: { ...INITIAL_FORM.preguntasCiberespacio, ...(source?.preguntasCiberespacio ?? {}) },
    }
}

function isFormComplete(formData: FormData) {
    return stepSchemas.every(schema => schema.safeParse(formData).success)
}

function getResumeStep(formData: FormData) {
    for (let i = 0; i < stepSchemas.length; i++) {
        if (!stepSchemas[i].safeParse(formData).success) return i
    }
    return STEPS.length - 1
}

function hasAnyAnswer(formData: FormData): boolean {
    return (
        formData.nombre !== '' ||
        formData.apellido !== '' ||
        formData.ocupacion !== '' ||
        formData.institucion !== '' ||
        formData.edad !== null ||
        formData.sexo !== null ||
        formData.lengua !== null ||
        formData.nivelEducacion !== null ||
        formData.ingresoDelHogar !== null ||
        formData.departamento !== '' ||
        Object.values(formData.p316).some(v => v !== null)
    )
}

function extractGoogleName(metadata: Record<string, string>): { nombre: string; apellido: string } {
    const fullName = metadata.full_name ?? metadata.name ?? ''
    const parts = fullName.trim().split(' ')
    const nombre = parts[0] ?? ''
    const apellido = parts.slice(1).join(' ') ?? ''
    return { nombre, apellido }
}

function SignOutButton({ onSignOut }: { onSignOut: () => Promise<void> }) {
    return (
        <button
            onClick={onSignOut}
            style={{
                padding: '0.8rem 1.4rem', borderRadius: 8,
                border: '2px solid rgba(0,0,0,0.12)', background: 'none',
                fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem',
                fontWeight: 600, color: '#6B7280', cursor: 'pointer',
            }}
        >
            Cerrar sesión
        </button>
    )
}

// ── Tipos de errores ──────────────────────────────────────────────
type Step0Errors = Partial<Record<'nombre' | 'apellido' | 'ocupacion' | 'institucion' | 'telefono', string>>
type Step6Errors = Partial<Record<'tratamientoDatos', string>>

export default function FormBlock({ verifiedUser, onSignOut }: FormBlockProps) {
    const [current, setCurrent] = useState(0)
    const [data, setData] = useState<FormData>(INITIAL_FORM)
    const [submitted, setSubmitted] = useState(false)
    const [stepError, setStepError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [hydrated, setHydrated] = useState(false)
    const [completed, setCompleted] = useState(false)
    const [resultado, setResultado] = useState<ResultadoINAD | null>(null)
    const [fromGoogle, setFromGoogle] = useState(false)
    const [step0Errors, setStep0Errors] = useState<Step0Errors>({})
    const [step6Errors, setStep6Errors] = useState<Step6Errors>({})  // ← nuevo

    useEffect(() => {
        let mounted = true

        const loadResponse = async () => {
            const isGoogle =
                verifiedUser.provider === 'google' ||
                Boolean(verifiedUser.user_metadata?.full_name)
            setFromGoogle(isGoogle)

            const response = await getFormResponse()
            if (!mounted) return

            if (response.success && response.data) {
                const savedData = mergeFormData(response.data)

                if (isGoogle && !savedData.nombre && verifiedUser.user_metadata) {
                    const { nombre, apellido } = extractGoogleName(verifiedUser.user_metadata)
                    savedData.nombre = nombre
                    savedData.apellido = apellido
                }

                setData(savedData)
                setCompleted(Boolean(response.completed))

                if (response.completed || isFormComplete(savedData)) {
                    const inad = calcularINAD(savedData)
                    setResultado(inad)
                    setSubmitted(true)
                } else {
                    setCurrent(getResumeStep(savedData))
                }
            } else {
                if (isGoogle && verifiedUser.user_metadata) {
                    const { nombre, apellido } = extractGoogleName(verifiedUser.user_metadata)
                    setData(prev => ({ ...prev, nombre, apellido }))
                }
            }

            setHydrated(true)
        }

        void loadResponse()
        return () => { mounted = false }
    }, [verifiedUser.id])

    const update = (fields: Partial<FormData>) => {
        setStepError('')
        // Limpiar error de tratamientoDatos en cuanto el usuario lo marque
        if ('tratamientoDatos' in fields) {
            setStep6Errors({})
        }
        setData(prev => ({ ...prev, ...fields }))
    }

    useEffect(() => {
        if (!hydrated || submitted || completed) return
        if (!hasAnyAnswer(data)) return
        const id = window.setTimeout(() => { void saveFormDraft(data) }, 700)
        return () => window.clearTimeout(id)
    }, [completed, data, hydrated, submitted])

    const currentIsValid = stepSchemas[current].safeParse(data).success

    const next = () => {
        const result = stepSchemas[current].safeParse(data)
        console.log('data.telefono:', JSON.stringify(data.telefono))
        console.log('safeParse result:', JSON.stringify(result, null, 2))
        setCurrent(s => Math.min(s + 1, STEPS.length - 1))
    }

    const back = () => setCurrent(s => Math.max(s - 1, 0))

    const submit = async () => {
        // Validación del checkbox obligatorio
        if (!data.tratamientoDatos) {
            setStep6Errors({ tratamientoDatos: 'Debes aceptar el tratamiento de datos personales para continuar.' })
            return
        }

        setStep6Errors({})
        setStepError('')
        setSubmitting(true)
        setSubmitError('')

        const inad = calcularINAD(data)
        setResultado(inad)

        const response = await completeFormResponse(data)

        if (!response.success) {
            setSubmitError(response.error || 'Error al enviar la evaluación')
            setSubmitting(false)
            return
        }

        setSubmitted(true)
        setCompleted(true)
        setSubmitting(false)
        try {
            const res = await fetch('/api/pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resultado: inad, email: verifiedUser.email }),
            })
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `INAD_${Date.now()}.pdf`
            a.click()
            URL.revokeObjectURL(url)
        } catch (err) {
            console.error('Error descargando PDF:', err)
        }
    }

    if (!hydrated) {
        return (
            <section id="verificacion" style={{ background: 'var(--bg)', padding: '5rem 2.5rem' }}>
                <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center', color: '#6B7280' }}>
                    Cargando...
                </div>
            </section>
        )
    }

    return (
        <section id="verificacion" style={{ background: 'var(--bg)', padding: '5rem 2.5rem' }}>
            <div style={{ maxWidth: 780, margin: '0 auto' }}>

                <p style={{
                    fontFamily: 'Syne, sans-serif', fontWeight: 700,
                    fontSize: '0.75rem', letterSpacing: '0.08em',
                    textTransform: 'uppercase', color: 'var(--coral)',
                    marginBottom: '0.5rem',
                }}>
                    Evaluación
                </p>
                <h2 style={{
                    fontFamily: 'Syne, sans-serif', fontWeight: 700,
                    fontSize: 'clamp(2.2rem, 3vw, 4rem)', color: 'var(--navy)',
                    letterSpacing: '-0.01em', lineHeight: 1.1, marginBottom: '1.5rem',
                }}>
                    {submitted ? `Resultados de ${data.nombre}` : 'Completa el formulario'}
                </h2>

                {!submitted && (
                    <div style={{ display: 'flex', gap: 4, marginBottom: '2rem' }}>
                        {STEPS.map((_, i) => (
                            <div key={i} style={{
                                flex: 1, height: 4, borderRadius: 2,
                                background: i < current ? 'var(--navy)' : i === current ? 'var(--teal)' : 'rgba(0,0,0,0.1)',
                                transition: 'background .3s',
                            }} />
                        ))}
                    </div>
                )}

                <div style={{
                    background: 'white', borderRadius: 16,
                    padding: '2.5rem',
                    boxShadow: '0 8px 32px rgba(10,58,107,0.07)',
                }}>
                    {submitted && resultado ? (
                        <ResultadoBlock
                            resultado={resultado}
                            email={verifiedUser.email}
                            onSignOut={onSignOut}
                        />
                    ) : (
                        <>
                            {current === 0 ? (
                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{
                                        fontFamily: 'Syne, sans-serif', fontSize: '1.6rem',
                                        fontWeight: 800, color: 'var(--navy)', marginBottom: '0.4rem',
                                    }}>
                                        Bienvenido
                                    </h3>
                                    <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                                        Antes de comenzar, cuéntanos un poco sobre ti.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <p style={{
                                        fontSize: '0.78rem', color: 'var(--teal)',
                                        fontWeight: 700, textTransform: 'uppercase',
                                        letterSpacing: '0.08em', marginBottom: '0.5rem',
                                    }}>
                                        Paso {current} de {STEPS.length - 1}
                                    </p>
                                    <h3 style={{
                                        fontFamily: 'Syne, sans-serif', fontSize: '1.3rem',
                                        fontWeight: 700, color: 'var(--navy)', marginBottom: '0.4rem',
                                    }}>
                                        {STEPS[current]}
                                    </h3>
                                    <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '2rem' }}>
                                        Todas las preguntas son obligatorias.
                                    </p>
                                </>
                            )}

                            {stepError && (
                                <p style={{ marginBottom: '1rem', color: 'var(--coral)', fontSize: '0.9rem', fontWeight: 600 }}>
                                    {stepError}
                                </p>
                            )}
                            {submitError && (
                                <p style={{ marginBottom: '1rem', color: 'var(--coral)', fontSize: '0.9rem', fontWeight: 600 }}>
                                    {submitError}
                                </p>
                            )}

                            {current === 0 && <Step0Form data={data} update={update} fromGoogle={fromGoogle} errors={step0Errors} />}
                            {current === 1 && <Step1Form data={data} update={update} />}
                            {current === 2 && <Step2Form data={data} update={update} />}
                            {current === 3 && <Step3Form data={data} update={update} />}
                            {current === 4 && <Step4Form data={data} update={update} />}
                            {current === 5 && <Step5Form data={data} update={update} />}
                            {current === 6 && <Step6Form data={data} update={update} errors={step6Errors} />}

                            <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', marginTop: '2.5rem',
                                paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.08)',
                            }}>
                                {current === 0 ? (
                                    <SignOutButton onSignOut={onSignOut} />
                                ) : (
                                    <button onClick={back} style={{
                                        padding: '0.8rem 1.8rem', borderRadius: 8,
                                        border: '2px solid rgba(0,0,0,0.15)', background: 'none',
                                        fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem',
                                        fontWeight: 600, color: '#6B7280', cursor: 'pointer',
                                    }}>
                                        ← Anterior
                                    </button>
                                )}

                                <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                                    {current === 0 ? '·' : `${current} / ${STEPS.length - 1}`}
                                </span>

                                <button
                                    onClick={current === STEPS.length - 1 ? submit : next}
                                    disabled={submitting}
                                    style={{
                                        padding: '0.8rem 1.8rem', borderRadius: 8, border: 'none',
                                        background: current === STEPS.length - 1 ? 'var(--teal)' : 'var(--navy)',
                                        color: 'white', fontFamily: 'DM Sans, sans-serif',
                                        fontSize: '0.9rem', fontWeight: 600,
                                        cursor: !submitting ? 'pointer' : 'not-allowed',
                                        opacity: !submitting ? 1 : 0.55,
                                        display: 'flex', alignItems: 'center', gap: '0.6rem',
                                    }}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                            Enviando...
                                        </>
                                    ) : (
                                        current === STEPS.length - 1 ? 'Enviar evaluación ✓' : 'Siguiente →'
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    )
}