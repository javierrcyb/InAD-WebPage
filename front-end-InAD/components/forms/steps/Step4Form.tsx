// VER QUE HACER CON ESTO

'use client'
import { FormData } from '@/types'

interface Props { data: FormData; update: (f: Partial<FormData>) => void }

const PREGUNTAS: { key: keyof FormData['p316']; num: string; texto: string }[] = [
  { key: 'p1',  num: 'P316.1',  texto: 'Obtener información' },
  { key: 'p2',  num: 'P316.2',  texto: 'Comunicarse (e-mail, chat, videollamada, etc.)' },
  { key: 'p3',  num: 'P316.3',  texto: 'Comprar productos y/o servicios' },
  { key: 'p4',  num: 'P316.4',  texto: 'Operaciones de banca electrónica y servicios financieros' },
  { key: 'p5',  num: 'P316.5',  texto: 'Educación formal y actividades de capacitación' },
  { key: 'p6',  num: 'P316.6',  texto: 'Transacciones con organizaciones estatales / autoridades públicas' },
  { key: 'p7',  num: 'P316.7',  texto: 'Entretenimiento (videojuegos, películas, música, radio, periódico, etc.)' },
  { key: 'p8',  num: 'P316.8',  texto: 'Vender productos y/o servicios (Mercado Libre, OLX, Facebook, etc.)' },
  { key: 'p12', num: 'P316.12', texto: 'Descarga de antivirus, aplicativos o software' },
]

export default function Step4PForm({ data, update }: Props) {
  const setP316 = (key: keyof FormData['p316'], val: boolean) =>
    update({ p316: { ...data.p316, [key]: val } })

  return (
    <div>
      <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        En los últimos 12 meses, ¿realizaste alguna de estas actividades por internet?
      </p>
      <div>
        {PREGUNTAS.map((q, i) => (
          <div
            key={q.key}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.9rem 0',
              borderBottom: i < PREGUNTAS.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
            }}
          >
            <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.72rem', fontWeight: 700, color: 'var(--teal)', minWidth: 52 }}>
              {q.num}
            </span>
            <span style={{ flex: 1, fontSize: '0.875rem', color: '#1A1A2E', lineHeight: 1.4 }}>
              {q.texto}
            </span>
            <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
              {[{ label: 'Sí', val: true }, { label: 'No', val: false }].map(({ label, val }) => {
                const selected = data.p316[q.key] === val
                return (
                  <button
                    key={label}
                    onClick={() => setP316(q.key, val)}
                    style={{
                      padding: '0.3rem 0.85rem', borderRadius: 6,
                      border: `1.5px solid ${selected ? (val ? 'var(--teal)' : 'var(--coral)') : 'rgba(0,0,0,0.12)'}`,
                      background: selected ? (val ? 'var(--teal)' : 'var(--coral)') : 'none',
                      color: selected ? 'white' : '#999',
                      fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                      transition: 'all .2s',
                    }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}