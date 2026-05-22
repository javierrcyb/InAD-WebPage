import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Índice de Inclusión Digital — ENAHO',
  description: 'Evalúa tu nivel de inclusión digital con base en el módulo P316 de la ENAHO del INEI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}