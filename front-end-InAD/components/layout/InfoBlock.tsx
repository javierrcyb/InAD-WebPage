const features = [

    {
        icon: '🔒',
        color: 'rgba(86,180,217,0.12)',
        title: 'Datos anónimos y protegidos',
        desc: 'Tus respuestas se almacenan de forma anonimizada.',
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
                <h2 style={{
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 500,
                    fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                    color: 'var(--navy)',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.1,
                    marginBottom: '3rem',
                    textRendering: 'optimizeLegibility',
                    WebkitFontSmoothing: 'antialiased',
                }}>
                    Índice de Actividad Digital (InAD)
                </h2>

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
                    ¿Qué es este índice?
                </p>

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>

                    {/* texto izquiera */}
                    <div>
                        <p style={{ fontSize: '1rem', lineHeight: 1.8, color: '#6B7280', marginBottom: '1.25rem' }}>
                            El <strong style={{ color: '#1A1A2E' }}>Índice de Inclusión Digital </strong> en la Encuesta Nacional de Hogares (ENAHO), mide cómo las personas usan y aprovechan internet en su vida diaria. Basado en datos de la ENAHO del INEI, evalúa actividades como educación, banca digital, trámites, comercio electrónico y acceso a servicios digitales.
                        </p>

                        <p style={{ fontSize: '1rem', lineHeight: 1.8, color: '#6B7280', marginBottom: '1.25rem' }}>
                            Más allá de tener conexión a internet, el índice analiza el nivel de participación digital de cada persona, desde usos básicos hasta actividades más avanzadas.                        </p>

                        <p style={{ fontSize: '1rem', lineHeight: 1.8, color: '#6B7280', marginBottom: '1.25rem' }}>
                            Al finalizar la evaluación recibirás un resultado personalizado con recursos y recomendaciones para fortalecer tus competencias digitales.                        </p>
                    </div>

                    {/* texto derecha    */}
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
                    <a
  href="#verificacion"
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.1rem 1.25rem',
    borderRadius: 10,
    border: '1px solid rgba(0,0,0,0.07)',
    background: 'var(--navy)',
    color: 'var(--bg)',
    textDecoration: 'none',
    fontWeight: 600,
    marginTop: '1rem',
    transition: 'all .2s ease',
  }}
>
  <span>Ir a la evaluación</span>
  <span>↓</span>
</a>
                    </div>

                </div>
            </div>
        </section>
    )
}