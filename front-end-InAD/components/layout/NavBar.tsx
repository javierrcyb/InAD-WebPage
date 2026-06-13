// Final Ahora si

export default function NavBar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-4"
            style={{ background: 'var(--coral)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(74,151,154,0.15)' }}>
            <div
                style={{
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 700,
                    color: 'var(--bg)',
                    fontSize: '1rem',
                    letterSpacing: '0.02em',
                    lineHeight: 1.1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textRendering: 'optimizeLegibility',
                    WebkitFontSmoothing: 'antialiased',
                }}
            >
                <span
                    style={{
                        width: 10,
                        height: 10,
                        background: 'var(--teal)',
                        borderRadius: '50%',
                        display: 'inline-block',
                    }}
                />
                NEUROMETRICS
            </div>
            <div className="flex items-center gap-6">
                <a href="#info" className="text-sm font-medium" style={{ color: 'var(--bg)', textDecoration: 'none' }}>¿Qué es?</a>
                <a href="#evaluacion" className="text-sm font-medium" style={{ color: 'var(--bg)', textDecoration: 'none' }}>Evaluación</a>
                <a
                    href="https://neurometrics.la/"
                    target="_blank"
                    className="text-sm font-semibold px-4 py-2 rounded-lg transition-all"
                    style={{ background: 'var(--navy)', color: 'white', textDecoration: 'none' }}
                >
                    Neurometrics →
                </a>
            </div>
        </nav>
    )
}