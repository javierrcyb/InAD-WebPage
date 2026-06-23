import logo from '@/lib/data/Logo Neurometrics blanco.png';
import flechaSVG from "@/lib/data/open-in-new-svgrepo-com.svg"

export default function NavBar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-7"
            style={{ background: 'var(--coral)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(74,151,154,0.15)' }}>
            <a
                href="/"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                }}
            >
                <img
                    src={logo.src}
                    alt="Neurometrics"
                    style={{
                        height: '20px',
                        width: 'auto',
                        display: 'block',
                    }}
                />
            </a>
            <div className="flex items-center gap-6">
                <a href="#info" className="text-base font-medium" style={{ color: 'var(--bg)', textDecoration: 'none' }}>¿Qué es?</a>
                <a href="#verificacion" className="text-base font-medium" style={{ color: 'var(--bg)', textDecoration: 'none' }}>Evaluación</a>
                <a
                    href="https://neurometrics.la/"
                    target="_blank"
                    className="text-base font-medium"
                    style={{ color: 'var(--bg)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px'}}
                >
                    Neurometrics
                    <img
                        src={flechaSVG.src}
                        alt=""
                        style={{ width: '1em', height: '1em', filter: 'brightness(0) invert(1)' }}
                    />
                </a>
            </div>
        </nav>
    )
}