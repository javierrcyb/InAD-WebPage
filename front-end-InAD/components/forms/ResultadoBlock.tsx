'use client'

import { ResultadoINAD } from '@/lib/calculations/InAdCalculation'
import { ReportePDF } from '@/pdf/ReportePDF'
import { PDFDownloadLink } from '@react-pdf/renderer'

type Props = {
    resultado: ResultadoINAD
    email: string
    onSignOut: () => Promise<void>
}

const NIVELES = [
    { label: 'Novato Digital', min: 0, max: 0.17, color: '#D36356' },
    { label: 'Entusiasta Digital', min: 0.17, max: 0.50, color: '#F58231' },
    { label: 'Ciudadano Digital', min: 0.50, max: 0.83, color: '#4A979A' },
    { label: 'Productor Digital', min: 0.83, max: 1.00, color: '#0A3A6B' },
]

function getNivelColor(inad: number): string {
    if (inad < 0.17) return '#D36356'
    if (inad < 0.50) return '#F58231'
    if (inad < 0.83) return '#4A979A'
    return '#0A3A6B'
}

function BarraNiveles({ inad }: { inad: number }) {
    const pct = inad * 100
    return (
        <div style={{ marginTop: '1.5rem', padding: '0 0.5rem' }}>
            <div style={{
                position: 'relative', height: 12, borderRadius: 6,
                overflow: 'visible', display: 'flex', gap: 2,
            }}>
                {NIVELES.map((nivel, i) => {
                    const width = (nivel.max - nivel.min) * 100
                    return (
                        <div key={nivel.label} style={{
                            flex: `0 0 calc(${width}% - 1px)`,
                            height: '100%',
                            background: nivel.color,
                            borderRadius: i === 0 ? '6px 0 0 6px' : i === NIVELES.length - 1 ? '0 6px 6px 0' : 0,
                            opacity: 0.3,
                            position: 'relative',
                        }} />
                    )
                })}
                <div style={{
                    position: 'absolute', left: `${pct}%`, top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 20, height: 20, borderRadius: '50%',
                    background: getNivelColor(inad),
                    border: '3px solid white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)', zIndex: 10,
                }} />
            </div>
            <div style={{ position: 'relative', height: 20, marginTop: '0.35rem' }}>
                {[
                    { val: 0, label: '0' },
                    { val: 0.17, label: '0.17' },
                    { val: 0.50, label: '0.50' },
                    { val: 0.83, label: '0.83' },
                    { val: 1, label: '1' },
                ].map(({ val, label }) => (
                    <span key={label} style={{
                        position: 'absolute', left: `${val * 100}%`,
                        transform: val === 0 ? 'translateX(0)' : val === 1 ? 'translateX(-100%)' : 'translateX(-50%)',
                        fontSize: '0.65rem', color: '#999', fontWeight: 500,
                    }}>
                        {label}
                    </span>
                ))}
            </div>
            <div style={{ display: 'flex', marginTop: '0.25rem', gap: 2 }}>
                {NIVELES.map(nivel => (
                    <div key={nivel.label} style={{
                        flex: `0 0 ${(nivel.max - nivel.min) * 100}%`,
                        textAlign: 'center', fontSize: '0.65rem',
                        fontWeight: 600, color: nivel.color, lineHeight: 1.3,
                    }}>
                        {nivel.label}
                    </div>
                ))}
            </div>
        </div>
    )
}

// ── Tipo explícito para los items de comparativa ──────────────────
type ComparativaItem = {
    name: string
    place: string
    promedio: number
    diff: number
    color: string
}

export default function ResultadoBlock({ resultado, email, onSignOut }: Props) {
    const r = resultado
    const nivelColor = getNivelColor(r.inad)

    const comparativaItems: ComparativaItem[] = [
        { name: 'Nacional', place: 'Perú', promedio: r.inad_nacional, diff: r.diff_nacional, color: '#0A3A6B' },
        { name: 'Macro región', place: r.macroRegion, promedio: r.inad_macroRegion, diff: r.diff_macroRegion, color: '#4A979A' },
        { name: 'Departamento', place: r.departamento, promedio: r.inad_departamento, diff: r.diff_departamento, color: '#185FA5' },
        { name: 'Distrito', place: r.distrito, promedio: r.inad_ubigeo, diff: r.diff_ubigeo, color: '#F58231' },
    ]

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* ── BLOQUE 1: Score + barra de niveles ── */}
            <div style={{
                background: 'white', borderRadius: 16, padding: '2rem 2.5rem',
                textAlign: 'center', boxShadow: '0 4px 20px rgba(10,58,107,0.07)',
            }}>
                <p style={{
                    fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: '#D36356',
                    marginBottom: '0.5rem', fontFamily: 'Syne, sans-serif',
                }}>
                    Tu resultado INAD
                </p>
                <div style={{
                    fontFamily: 'Syne, sans-serif', fontWeight: 800,
                    fontSize: 'clamp(4rem, 10vw, 6rem)', color: nivelColor, lineHeight: 1,
                }}>
                    {r.inad.toFixed(2)}
                </div>
                <div style={{
                    display: 'inline-block', marginTop: '0.75rem',
                    padding: '0.35rem 1.2rem', borderRadius: 100,
                    background: nivelColor + '18', color: nivelColor,
                    fontWeight: 700, fontSize: '0.95rem',
                }}>
                    {r.nivel}
                </div>
                <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#6B7280' }}>
                    Realizas{' '}
                    <strong style={{ color: '#0A3A6B' }}>{r.score} de 9</strong>
                    {' '}actividades digitales medidas por la ENAHO
                </p>
                <BarraNiveles inad={r.inad} />
            </div>

            {/* ── BLOQUE 2: Comparativa zoom geográfico ── */}
            <div style={{
                background: 'white', borderRadius: 16, padding: '2rem',
                boxShadow: '0 4px 20px rgba(10,58,107,0.07)',
            }}>
                <p style={{
                    fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: '#D36356',
                    marginBottom: '0.4rem', fontFamily: 'Syne, sans-serif',
                }}>
                    Comparativa
                </p>
                <h3 style={{
                    fontFamily: 'Syne, sans-serif', fontSize: '1.1rem',
                    fontWeight: 700, color: '#0A3A6B', marginBottom: '1.5rem',
                }}>
                    Tu posición relativa
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {comparativaItems.map((item, i) => {
                        const pos = item.diff >= 0
                        const isLast = i === comparativaItems.length - 1
                        return (
                            <div key={i} style={{ display: 'flex', alignItems: 'stretch' }}>

                                {/* Indentación de niveles anteriores */}
                                {Array.from({ length: i }, (_, j) => (
                                    <div key={j} style={{ width: 20, flexShrink: 0, position: 'relative' }}>
                                        <div style={{
                                            position: 'absolute', left: 10, top: 0, bottom: 0,
                                            width: 1.5, background: '#F0EFEB',
                                        }} />
                                    </div>
                                ))}

                                {/* Columna del nivel actual: línea + dot */}
                                <div style={{ width: 20, flexShrink: 0, position: 'relative' }}>
                                    {!isLast && (
                                        <div style={{
                                            position: 'absolute', left: 10, top: 0, bottom: 0,
                                            width: 1.5, background: '#F0EFEB',
                                        }} />
                                    )}
                                    <div style={{
                                        position: 'absolute', left: 5, top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: 10, height: 10, borderRadius: '50%',
                                        background: item.color, border: '2px solid white',
                                        boxShadow: `0 0 0 1.5px ${item.color}`,
                                    }} />
                                </div>

                                {/* Celda de datos */}
                                <div style={{
                                    flex: 1, margin: '3px 0', padding: '0.6rem 0.9rem',
                                    borderRadius: 8, border: `0.5px solid ${item.color}30`,
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    background: `${item.color}05`,
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontSize: '0.65rem', fontWeight: 700,
                                            textTransform: 'uppercase', letterSpacing: '0.06em',
                                            color: '#bbb', lineHeight: 1,
                                        }}>
                                            {item.name}
                                        </div>
                                        <div style={{
                                            fontSize: '0.85rem', fontWeight: 700,
                                            color: item.color, marginTop: 2,
                                        }}>
                                            {item.place}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{
                                            fontSize: '1.4rem', fontWeight: 800,
                                            color: item.color, lineHeight: 1,
                                        }}>
                                            {item.promedio.toFixed(2)}
                                        </div>
                                        <span style={{
                                            display: 'inline-block',
                                            fontSize: '0.68rem', fontWeight: 700,
                                            padding: '0.12rem 0.45rem', borderRadius: 100,
                                            marginTop: 4,
                                            background: pos ? 'rgba(74,151,154,0.12)' : 'rgba(211,99,86,0.12)',
                                            color: pos ? '#0F6E56' : '#D36356',
                                        }}>
                                            {pos ? `+${item.diff.toFixed(2)}` : item.diff.toFixed(2)} vs tú
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ── BLOQUE 3: Temas a desarrollar ── */}
            {r.temas_desarrollar.length > 0 && (
                <div style={{
                    background: 'white', borderRadius: 16, padding: '2rem',
                    boxShadow: '0 4px 20px rgba(10,58,107,0.07)',
                }}>
                    <p style={{
                        fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
                        textTransform: 'uppercase', color: '#D36356',
                        marginBottom: '0.4rem', fontFamily: 'Syne, sans-serif',
                    }}>
                        Áreas de mejora
                    </p>
                    <h3 style={{
                        fontFamily: 'Syne, sans-serif', fontSize: '1.1rem',
                        fontWeight: 700, color: '#0A3A6B', marginBottom: '1.25rem',
                    }}>
                        Temas que debes desarrollar
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {r.temas_desarrollar.map(tema => (
                            <div key={tema.key} style={{
                                borderLeft: '3px solid #D36356',
                                paddingLeft: '1.25rem', paddingTop: '0.25rem', paddingBottom: '0.25rem',
                            }}>
                                <div style={{ fontWeight: 700, color: '#0A3A6B', fontSize: '0.95rem', marginBottom: '0.3rem' }}>
                                    {tema.tema}
                                </div>
                                <div style={{ fontSize: '0.84rem', color: '#6B7280', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                                    {tema.descripcion}
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {tema.cursos.map(curso => (
                                        <a key={curso.nombre} href={curso.url} target="_blank" rel="noopener noreferrer"
                                            style={{
                                                display: 'flex', flexDirection: 'column',
                                                padding: '0.55rem 0.9rem', borderRadius: 8,
                                                border: '1.5px solid rgba(0,0,0,0.08)',
                                                textDecoration: 'none', background: '#F5F4F0', minWidth: 160,
                                            }}
                                        >
                                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0A3A6B' }}>
                                                {curso.nombre}
                                            </span>
                                            <span style={{ fontSize: '0.75rem', color: '#4A979A', marginTop: '0.15rem' }}>
                                                {curso.plataforma} · {curso.duracion}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── BLOQUE 4: Lo que ya dominas ── */}
            {r.temas_dominados.length > 0 && (
                <div style={{
                    background: 'white', borderRadius: 16, padding: '2rem',
                    boxShadow: '0 4px 20px rgba(10,58,107,0.07)',
                }}>
                    <p style={{
                        fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
                        textTransform: 'uppercase', color: '#4A979A',
                        marginBottom: '0.4rem', fontFamily: 'Syne, sans-serif',
                    }}>
                        Fortalezas
                    </p>
                    <h3 style={{
                        fontFamily: 'Syne, sans-serif', fontSize: '1.1rem',
                        fontWeight: 700, color: '#0A3A6B', marginBottom: '1rem',
                    }}>
                        Lo que ya dominas
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {r.temas_dominados.map(tema => (
                            <div key={tema.key} style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '0.75rem 1rem', borderRadius: 8,
                                background: 'rgba(74,151,154,0.07)', borderLeft: '3px solid #4A979A',
                            }}>
                                <span style={{ fontSize: '0.9rem', color: '#4A979A', fontWeight: 700 }}>✓</span>
                                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0A3A6B' }}>
                                    {tema.tema}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Footer ── */}
            <div style={{
                background: 'rgba(10,58,107,0.04)', borderRadius: 12,
                padding: '1.25rem 1.5rem', display: 'flex',
                alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: '1rem',
            }}>
                <div>
                    <div style={{ fontSize: '0.78rem', color: '#6B7280', marginBottom: '0.15rem' }}>
                        Reporte enviado a
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0A3A6B' }}>
                        {email}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <PDFDownloadLink
                        document={<ReportePDF resultado={resultado} email={email} />}
                        fileName={`reporte-inad-${r.nombre.toLowerCase().replace(/\s+/g, '-')}.pdf`}
                        style={{ textDecoration: 'none' }}
                    >
                        {({ loading }) => (
                            <button style={{
                                padding: '0.7rem 1.4rem', borderRadius: 8,
                                border: '2px solid #0A3A6B', background: '#0A3A6B',
                                fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem',
                                fontWeight: 600, color: 'white', cursor: loading ? 'wait' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                            }}>
                                {loading ? 'Preparando...' : '↓ Descargar PDF'}
                            </button>
                        )}
                    </PDFDownloadLink>

                    <button onClick={onSignOut} style={{
                        padding: '0.7rem 1.4rem', borderRadius: 8,
                        border: '2px solid rgba(0,0,0,0.12)', background: 'none',
                        fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem',
                        fontWeight: 600, color: '#6B7280', cursor: 'pointer',
                    }}>
                        Cerrar sesión
                    </button>
                </div>
            </div>

        </div>
    )
}