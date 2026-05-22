const features = [
    {
        icon: '📊',
        color: 'rgba(74,151,154,0.12)',
        title: 'Metodología ENAHO oficial',
        desc: 'Preguntas directamente extraídas del módulo P316 aplicado a nivel nacional por el INEI.',
    },
    {
        icon: '🔒',
        color: 'rgba(86,180,217,0.12)',
        title: 'Datos anónimos y protegidos',
        desc: 'Tus respuestas se almacenan de forma anonimizada conforme a la Ley N° 29733.',
    },
    {
        icon: '🎯',
        color: 'rgba(211,99,86,0.12)',
        title: 'Resultado personalizado',
        desc: 'Obtienes un índice basado en tu perfil socioeconómico, educativo y geográfico real.',
    },
    {
        icon: '📄',
        color: 'rgba(245,130,49,0.12)',
        title: 'Descarga tu reporte en PDF',
        desc: 'Al finalizar podrás descargar un informe con tu resultado y recursos recomendados.',
    },
]

export default function InfoBlock() {
    return (
        <section
            id="info"
            style={{ background: 'white', padding: '5rem 2.5rem', paddingTop: '8rem' }}
        >
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>

                {/* Header */}
                <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--coral)', marginBottom: '0.5rem', fontFamily: 'Syne, sans-serif' }}>
                    ¿Qué es este índice?
                </p>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 2.5vw, 2.4rem)', color: 'var(--navy)', letterSpacing: '-0.02em', marginBottom: '3rem' }}>
                    Basado en metodología oficial ENAHO · INEI
                </h2>

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>

                    {/* Left — texto */}
                    <div>
                        <p style={{ fontSize: '1rem', lineHeight: 1.8, color: '#6B7280', marginBottom: '1.25rem' }}>
                            El <strong style={{ color: '#1A1A2E' }}>Índice de Inclusión Digital</strong> es una herramienta de diagnóstico construida sobre el módulo P316 de la Encuesta Nacional de Hogares (ENAHO), levantada por el INEI. Evalúa en qué medida las personas acceden, usan y aprovechan las tecnologías de información y comunicación.
                        </p>

                        <p style={{ fontSize: '1rem', lineHeight: 1.8, color: '#6B7280', marginBottom: '1.25rem' }}>
                            No mide únicamente si tienes internet, sino <strong style={{ color: '#1A1A2E' }}>cómo lo usas</strong>: si realizas operaciones bancarias, si accedes a servicios del Estado, si te capacitas o si participas en el comercio digital.
                        </p>

                        <p style={{ fontSize: '1rem', lineHeight: 1.8, color: '#6B7280' }}>
                            Al completar el formulario recibirás un resultado personalizado con recursos concretos para avanzar hacia una mayor inclusión digital.
                        </p>

                        <a
                            href="#evaluacion"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginTop: '2rem',
                                background: 'var(--navy)',
                                color: 'white',
                                padding: '0.85rem 1.8rem',
                                borderRadius: 8,
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                textDecoration: 'none',
                            }}
                        >
                            Ir a la evaluación ↓
                        </a>
                    </div>

                    {/* Right — features */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {features.map((f) => (
                            <div
                                key={f.title}
                                style={{
                                    display: 'flex', gap: '1rem', alignItems: 'flex-start',
                                    padding: '1.1rem 1.25rem', borderRadius: 10,
                                    border: '1px solid rgba(0,0,0,0.07)',
                                }}
                            >
                                <div style={{ width: 36, height: 36, borderRadius: 8, background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                                    {f.icon}
                                </div>
                                <div>
                                    <strong style={{ display: 'block', fontSize: '0.9rem', color: '#1A1A2E', marginBottom: '0.2rem' }}>{f.title}</strong>
                                    <span style={{ fontSize: '0.83rem', color: '#6B7280', lineHeight: 1.5 }}>{f.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}