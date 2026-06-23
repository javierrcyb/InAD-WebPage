'use client'

import { ResultadoINAD } from '@/lib/calculations/InAdCalculation'

type Props = {
    resultado: ResultadoINAD
    email: string
    onSignOut: () => Promise<void>
}

// ── helpers ──────────────────────────────────────────────────────────────────

function DiffBadge({ diff }: { diff: number }) {
    const positivo = diff >= 0
    return (
        <span style={{
            fontSize: '0.78rem', fontWeight: 700,
            color: positivo ? '#4A979A' : '#D36356',
        }}>
            {positivo ? `+${diff}` : diff} pts vs tú
        </span>
    )
}

function ComparativaCard({
    label, sublabel, promedio, diff,
}: {
    label: string
    sublabel: string
    promedio: number
    diff: number
}) {
    return (
        <div style={{
            background: '#F5F4F0', borderRadius: 12,
            padding: '1.25rem', textAlign: 'center', flex: 1,
        }}>
            <div style={{
                fontFamily: 'Syne, sans-serif', fontSize: '2rem',
                fontWeight: 800, color: '#0A3A6B', lineHeight: 1,
            }}>
                {promedio.toFixed(2)}
            </div>
            <div style={{
                fontSize: '0.72rem', fontWeight: 700, color: '#4A979A',
                textTransform: 'uppercase', letterSpacing: '0.06em',
                marginTop: '0.3rem',
            }}>
                {sublabel}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '0.15rem' }}>
                {label}
            </div>
            <div style={{ marginTop: '0.5rem' }}>
                <DiffBadge diff={diff} />
            </div>
        </div>
    )
}

// ── componente principal ──────────────────────────────────────────────────────

export default function ResultadoBlock({ resultado, email, onSignOut }: Props) {
    const r = resultado

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* ── Score principal ── */}
            <div style={{
                background: 'white', borderRadius: 16,
                padding: '2.5rem', textAlign: 'center',
                boxShadow: '0 4px 20px rgba(10,58,107,0.07)',
            }}>
                {/* Título */}
                <p style={{
                    fontSize: '0.75rem', fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: '#D36356', marginBottom: '0.5rem',
                    fontFamily: 'Syne, sans-serif',
                }}>
                    Tu resultado INAD
                </p>

                {/* Score */}
                <div style={{
                    fontFamily: 'Syne, sans-serif', fontWeight: 800,
                    fontSize: 'clamp(4rem, 10vw, 6rem)',
                    color: r.nivel_color, lineHeight: 1,
                }}>
                    {r.inad.toFixed(2)}
                </div>

                {/* Nivel badge */}
                <div style={{
                    display: 'inline-block', marginTop: '0.75rem',
                    padding: '0.35rem 1.2rem', borderRadius: 100,
                    background: r.nivel_color + '22',
                    color: r.nivel_color, fontWeight: 700, fontSize: '0.95rem',
                }}>
                    Nivel {r.nivel}
                </div>

                {/* Barra */}
                <div style={{
                    margin: '1.5rem auto 0', maxWidth: 400,
                    height: 10, background: '#eee', borderRadius: 5, overflow: 'hidden',
                }}>
                    <div style={{
                        height: '100%', borderRadius: 5,
                        width: `${r.inad * 100}%`,
                        background: r.nivel_color,
                        transition: 'width 1.2s ease',
                    }} />
                </div>

                {/* Actividades */}
                <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#6B7280' }}>
                    Realizas <strong style={{ color: '#0A3A6B' }}>{r.score} de 9</strong> actividades digitales medidas por la ENAHO
                </p>
            </div>

            {/* ── Comparativas ── */}
            <div style={{
                background: 'white', borderRadius: 16,
                padding: '2rem', boxShadow: '0 4px 20px rgba(10,58,107,0.07)',
            }}>
                <p style={{
                    fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: '#D36356',
                    marginBottom: '1.25rem', fontFamily: 'Syne, sans-serif',
                }}>
                    Comparativa
                </p>

                {/* Fila 1: ubigeo exacto, departamento, macroregión */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <ComparativaCard
                        label="Tu ubigeo"
                        sublabel={r.distrito}
                        promedio= {r.inad_ubigeo}
                        diff= {r.diff_ubigeo}
                    />
                    <ComparativaCard
                        label="Departamento"
                        sublabel={r.departamento}
                        promedio={r.inad_departamento}
                        diff={r.diff_departamento}
                    />
                    <ComparativaCard
                        label="Macro región"
                        sublabel={r.macroRegion}
                        promedio={r.inad_macroRegion}
                        diff={r.diff_macroRegion}
                    />
                </div>

                {/* Fila 2: nacional centrado */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                    <div style={{ width: 'calc(33.33% - 0.67rem)', minWidth: 160 }}>
                        <ComparativaCard
                            label="Nacional"
                            sublabel="Perú"
                            promedio={r.inad_nacional}
                            diff={r.diff_nacional}
                        />
                    </div>
                </div>
            </div>

            {/* ── Ubigeo ── */}
            <div style={{
                background: 'white', borderRadius: 16,
                padding: '1.5rem 2rem', boxShadow: '0 4px 20px rgba(10,58,107,0.07)',
                display: 'flex', gap: '2.5rem', flexWrap: 'wrap',
            }}>
                {[
                    { label: 'Código ubigeo', valor: r.ubigeo_distrito },
                    { label: 'Departamento', valor: r.departamento },
                    { label: 'Provincia', valor: r.provincia },
                    { label: 'Distrito', valor: r.distrito },
                    { label: 'Macro Región', valor: r.macroRegion },
                ].map(item => (
                    <div key={item.label}>
                        <div style={{
                            fontSize: '0.72rem', color: '#6B7280',
                            textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600,
                        }}>
                            {item.label}
                        </div>
                        <div style={{
                            fontSize: '1rem', fontWeight: 700,
                            color: '#0A3A6B', marginTop: '0.2rem',
                        }}>
                            {item.valor || '—'}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Temas a desarrollar ── */}
            {r.temas_desarrollar.length > 0 && (
                <div style={{
                    background: 'white', borderRadius: 16,
                    padding: '2rem', boxShadow: '0 4px 20px rgba(10,58,107,0.07)',
                }}>
                    <p style={{
                        fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
                        textTransform: 'uppercase', color: '#D36356',
                        marginBottom: '0.5rem', fontFamily: 'Syne, sans-serif',
                    }}>
                        Áreas de mejora
                    </p>
                    <h3 style={{
                        fontFamily: 'Syne, sans-serif', fontSize: '1.2rem',
                        fontWeight: 700, color: '#0A3A6B', marginBottom: '1.5rem',
                    }}>
                        Temas que debes desarrollar
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {r.temas_desarrollar.map(tema => (
                            <div key={tema.key} style={{
                                borderLeft: '4px solid #D36356',
                                paddingLeft: '1.25rem', paddingTop: '0.25rem', paddingBottom: '0.25rem',
                            }}>
                                <div style={{
                                    fontWeight: 700, color: '#0A3A6B',
                                    fontSize: '0.95rem', marginBottom: '0.3rem',
                                }}>
                                    {tema.tema}
                                </div>
                                <div style={{
                                    fontSize: '0.84rem', color: '#6B7280',
                                    lineHeight: 1.6, marginBottom: '0.75rem',
                                }}>
                                    {tema.descripcion}
                                </div>

                                {/* Cursos */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {tema.cursos.map(curso => (
                                        <a
                                            key={curso.nombre}
                                            href={curso.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'flex', flexDirection: 'column',
                                                padding: '0.55rem 0.9rem', borderRadius: 8,
                                                border: '1.5px solid rgba(0,0,0,0.1)',
                                                textDecoration: 'none', background: '#F5F4F0',
                                                minWidth: 160,
                                            }}
                                        >
                                            <span style={{
                                                fontSize: '0.82rem', fontWeight: 700, color: '#0A3A6B',
                                            }}>
                                                {curso.nombre}
                                            </span>
                                            <span style={{
                                                fontSize: '0.75rem', color: '#4A979A', marginTop: '0.15rem',
                                            }}>
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

            {/* ── Lo que ya dominas ── */}
            {r.temas_dominados.length > 0 && (
                <div style={{
                    background: 'white', borderRadius: 16,
                    padding: '2rem', boxShadow: '0 4px 20px rgba(10,58,107,0.07)',
                }}>
                    <p style={{
                        fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
                        textTransform: 'uppercase', color: '#4A979A',
                        marginBottom: '0.5rem', fontFamily: 'Syne, sans-serif',
                    }}>
                        Fortalezas
                    </p>
                    <h3 style={{
                        fontFamily: 'Syne, sans-serif', fontSize: '1.2rem',
                        fontWeight: 700, color: '#0A3A6B', marginBottom: '1.25rem',
                    }}>
                        Lo que ya dominas
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {r.temas_dominados.map(tema => (
                            <div key={tema.key} style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '0.75rem 1rem', borderRadius: 8,
                                background: 'rgba(74,151,154,0.07)',
                                borderLeft: '4px solid #4A979A',
                            }}>
                                <span style={{ fontSize: '1rem' }}>✓</span>
                                <span style={{
                                    fontSize: '0.9rem', fontWeight: 600, color: '#0A3A6B',
                                }}>
                                    {tema.tema}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Footer con correo y cerrar sesión ── */}
            <div style={{
                background: 'rgba(10,58,107,0.04)',
                borderRadius: 12, padding: '1.25rem 1.5rem',
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
            }}>
                <div>
                    <div style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '0.15rem' }}>
                        Reporte enviado a
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0A3A6B' }}>
                        {email}
                    </div>
                </div>
                <button
                    onClick={onSignOut}
                    style={{
                        padding: '0.7rem 1.4rem', borderRadius: 8,
                        border: '2px solid rgba(0,0,0,0.12)', background: 'none',
                        fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem',
                        fontWeight: 600, color: '#6B7280', cursor: 'pointer',
                    }}
                >
                    Cerrar sesión
                </button>
            </div>

        </div>
    )
}
