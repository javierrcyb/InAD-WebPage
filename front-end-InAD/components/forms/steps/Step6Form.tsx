'use client'
import { FormData } from '@/types'

interface Props {
  data:   FormData
  update: (f: Partial<FormData>) => void
  errors?: { tratamientoDatos?: string }
}

const PREGUNTASCIBERSPACE: { key: keyof FormData['preguntasCiberespacio']; num: string; texto: string }[] = [
  { key: 'CSB1', num: 'CS.1',  texto: 'Configurar contraseñas, autenticación y privacidad digital' },
  { key: 'CSB2', num: 'CS.2',  texto: 'Identificar y evitar mensajes, correos o enlaces sospechosos' },
  { key: 'CSB3', num: 'CS.3',  texto: 'Utilizar redes Wi-Fi públicas con precaución' },
  { key: 'CSI1', num: 'CS.4',  texto: 'Instalar o actualizar herramientas de protección digital' },
  { key: 'CSI2', num: 'CS.5',  texto: 'Gestionar la identidad digital y la privacidad en línea' },
  { key: 'CSI3', num: 'CS.6',  texto: 'Participar en comunidades o espacios digitales de interés público' },
  { key: 'CSI4', num: 'CS.7',  texto: 'Verificar información y detectar desinformación en línea' },
  { key: 'CSA1', num: 'CS.8',  texto: 'Reportar incidentes de ciberseguridad o fraude digital' },
  { key: 'CSA2', num: 'CS.9',  texto: 'Utilizar VPN u otras herramientas de protección de la conexión' },
  { key: 'CSA3', num: 'CS.10', texto: 'Participar en iniciativas sobre regulación o gobernanza del ciberespacio' },
]

export default function Step6Form({ data, update, errors }: Props) {
  const setPreguntasCiberespacio = (key: keyof FormData['preguntasCiberespacio'], val: boolean) =>
    update({ preguntasCiberespacio: { ...data.preguntasCiberespacio, [key]: val } })

  return (
    <div>
      {/* ── Preguntas de ciberespacio ── */}
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

      {/* ── Sección de consentimientos ── */}
      <div style={{
        marginTop: '2.5rem',
        paddingTop: '2rem',
        borderTop: '1px solid rgba(0,0,0,0.08)',
      }}>

        {/* Boletín y aliados (opcionales) */}
        <p style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 700,
          fontSize: '0.85rem', color: 'var(--navy)',
          marginBottom: '1rem', letterSpacing: '-0.01em',
        }}>
          Boletín Neurometrics y aliados
        </p>

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', marginBottom: '0.85rem' }}>
          <input
            type="checkbox"
            checked={data.boletinNeurometrics}
            onChange={e => update({ boletinNeurometrics: e.target.checked })}
            style={{ marginTop: 2, width: 16, height: 16, accentColor: 'var(--teal)', flexShrink: 0, cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.5 }}>
            Quiero suscribirme al boletín de Neurometrics para mantenerme informado de esta y otras actividades.
          </span>
        </label>

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', marginBottom: '1.75rem' }}>
          <input
            type="checkbox"
            checked={data.aceptaAliados}
            onChange={e => update({ aceptaAliados: e.target.checked })}
            style={{ marginTop: 2, width: 16, height: 16, accentColor: 'var(--teal)', flexShrink: 0, cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.5 }}>
            Acepto el tratamiento de mis datos personales con las instituciones aliadas a este evento.
          </span>
        </label>

        {/* Tratamiento de datos (obligatorio) */}

          <p style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 700,
            fontSize: '0.85rem', color: 'var(--navy)',
            marginBottom: '0.75rem',
          }}>
            Tratamiento de datos personales <span style={{ color: 'var(--coral)' }}>*</span>
          </p>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={data.tratamientoDatos}
              onChange={e => update({ tratamientoDatos: e.target.checked })}
              style={{ marginTop: 2, width: 16, height: 16, accentColor: 'var(--teal)', flexShrink: 0, cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.5 }}>
              Acepto los{' '}
              <a
                href="https://neurometrics.la/terminos-y-condiciones-para-datos-personales/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--teal)', fontWeight: 600, textDecoration: 'underline' }}
              >
                términos y condiciones
              </a>
              {' '}para el tratamiento de mis datos personales y finalidades necesarias.
            </span>
          </label>

          {errors?.tratamientoDatos && (
            <p style={{ marginTop: '0.6rem', fontSize: '0.8rem', color: 'var(--coral)', fontWeight: 600 }}>
              {errors.tratamientoDatos}
            </p>
          )}
      </div>
    </div>
  )
}