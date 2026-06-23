'use client'
import { FormData } from '@/types'

interface Props { data: FormData; update: (f: Partial<FormData>) => void }

const PREGUNTASCIBERSPACE: { key: keyof FormData['preguntasCiberespacio']; num: string; texto: string }[] = [
  { key: 'CSB1',  num: 'CS.1',  texto: 'Configurar contraseñas, autenticación y privacidad digital' },
  { key: 'CSB2',  num: 'CS.2',  texto: 'Identificar y evitar mensajes, correos o enlaces sospechosos' },
  { key: 'CSB3',  num: 'CS.3',  texto: 'Utilizar redes Wi-Fi públicas con precaución' },
  { key: 'CSI1',  num: 'CS.4',  texto: 'Instalar o actualizar herramientas de protección digital' },
  { key: 'CSI2',  num: 'CS.5',  texto: 'Gestionar la identidad digital y la privacidad en línea' },
  { key: 'CSI3',  num: 'CS.6',  texto: 'Participar en comunidades o espacios digitales de interés público' },
  { key: 'CSI4',  num: 'CS.7',  texto: 'Verificar información y detectar desinformación en línea' },
  { key: 'CSA1',  num: 'CS.8',  texto: 'Reportar incidentes de ciberseguridad o fraude digital' },
  { key: 'CSA2',  num: 'CS.9',  texto: 'Utilizar VPN u otras herramientas de protección de la conexión' },
  { key: 'CSA3',  num: 'CS.10', texto: 'Participar en iniciativas sobre regulación o gobernanza del ciberespacio' },
]

export default function Step6PForm({ data, update }: Props) {
  const setPreguntasCiberespacio = (key: keyof FormData['preguntasCiberespacio'], val: boolean) =>
    update({ preguntasCiberespacio: { ...data.preguntasCiberespacio, [key]: val } })

  return (
    <div>
      <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        En los últimos 12 meses, ¿realizaste alguna de las siguientes actividades relacionadas con la seguridad, 
        participación y uso responsable del ciberespacio?
      </p>
      <div>
        {PREGUNTASCIBERSPACE.map((q, i) => (
          <div
            key={q.key}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.9rem 0',
              borderBottom: i < PREGUNTASCIBERSPACE.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
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
                const selected = data.preguntasCiberespacio[q.key] === val
                return (
                  <button
                    key={label}
                    onClick={() => setPreguntasCiberespacio(q.key, val)}
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