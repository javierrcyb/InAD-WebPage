// VER QUE HACER CON ESTO

'use client'

import { useState } from 'react'
import { FormData, INITIAL_FORM } from '@/types'
import Step1Perfil from './steps/Step1Perfil'
import Step2Educacion from './steps/Step2Education'
import Step3Ubicacion from './steps/Step3Ubicacion'
import Step4P316 from './steps/Step4P316'

const STEPS = ['Perfil personal', 'Educación e ingresos', 'Ubicación', 'Actividades digitales']

export default function FormBlock() {
    const [current, setCurrent] = useState(0)
    const [data, setData] = useState<FormData>(INITIAL_FORM)
    const [submitted, setSubmitted] = useState(false)

    const update = (fields: Partial<FormData>) =>
        setData(prev => ({ ...prev, ...fields }))

    const next = () => setCurrent(s => Math.min(s + 1, STEPS.length - 1))
    const back = () => setCurrent(s => Math.max(s - 1, 0))

    const submit = async () => {
        // TODO: POST /api/responses
        console.log('Enviando:', data)
        setSubmitted(true)
    }

    return (
        <section id="evaluacion" style={{ background: 'var(--bg)', padding: '5rem 2.5rem' }}>
            <div style={{ maxWidth: 780, margin: '0 auto' }}>

                {/* Header */}
                <p
                    style={{
                        fontFamily: 'Syne, sans-serif',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        letterSpacing: '0.08em',
                        lineHeight: 1.1,
                        textTransform: 'uppercase',
                        color: 'var(--coral)',
                        marginBottom: '0.5rem',
                        textRendering: 'optimizeLegibility',
                        WebkitFontSmoothing: 'antialiased',
                    }}
                >
                    Evaluación
                </p>

                <h2
                    style={{
                        fontFamily: 'Syne, sans-serif',
                        fontWeight: 700,
                        fontSize: 'clamp(2.2rem, 3vw, 4rem)',
                        color: 'var(--navy)',
                        letterSpacing: '-0.01em',
                        lineHeight: 1.1,
                        marginBottom: '1.5rem',
                        textRendering: 'optimizeLegibility',
                        WebkitFontSmoothing: 'antialiased',
                    }}
                >
                    Completa el formulario
                </h2>

                {/* Progress */}
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

                {/* Card */}
                <div style={{ background: 'white', borderRadius: 16, padding: '2.5rem', boxShadow: '0 8px 32px rgba(10,58,107,0.07)' }}>

                    {submitted ? (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.75rem' }}>
                                ¡Evaluación completada!
                            </h3>
                            <p style={{ color: '#6B7280', lineHeight: 1.7 }}>
                                Tus respuestas han sido registradas. Pronto recibirás tu índice de inclusión digital con recursos personalizados.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Step label */}
                            <p style={{ fontSize: '0.78rem', color: 'var(--teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                                Paso {current + 1} de {STEPS.length}
                            </p>
                            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.4rem' }}>
                                {STEPS[current]}
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '2rem' }}>
                                Todas las preguntas son obligatorias.
                            </p>

                            {/* Steps */}
                            {current === 0 && <Step1Perfil data={data} update={update} />}
                            {current === 1 && <Step2Educacion data={data} update={update} />}
                            {current === 2 && <Step3Ubicacion data={data} update={update} />}
                            {current === 3 && <Step4P316 data={data} update={update} />}

                            {/* Navigation */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                                <button
                                    onClick={back}
                                    style={{
                                        visibility: current > 0 ? 'visible' : 'hidden',
                                        padding: '0.8rem 1.8rem', borderRadius: 8,
                                        border: '2px solid rgba(0,0,0,0.15)', background: 'none',
                                        fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', fontWeight: 600,
                                        color: '#6B7280', cursor: 'pointer',
                                    }}
                                >
                                    ← Anterior
                                </button>

                                <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                                    {current + 1} / {STEPS.length}
                                </span>

                                <button
                                    onClick={current === STEPS.length - 1 ? submit : next}
                                    style={{
                                        padding: '0.8rem 1.8rem', borderRadius: 8, border: 'none',
                                        background: current === STEPS.length - 1 ? 'var(--teal)' : 'var(--navy)',
                                        color: 'white', fontFamily: 'DM Sans, sans-serif',
                                        fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                                    }}
                                >
                                    {current === STEPS.length - 1 ? 'Enviar evaluación ✓' : 'Siguiente →'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    )
}