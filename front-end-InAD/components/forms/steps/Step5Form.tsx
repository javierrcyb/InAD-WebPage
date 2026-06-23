'use client'
import { FormData } from '@/types'

interface Props { data: FormData; update: (f: Partial<FormData>) => void }

const PREGUNTASIA: { key: keyof FormData['preguntasIA']; num: string; texto: string }[] = [
  { key: 'IAB1',  num: 'IA.1',  texto: 'Obtener respuestas, explicaciones o resolver dudas mediante IA' },
  { key: 'IAB2',  num: 'IA.2',  texto: 'Redactar, resumir, corregir o mejorar textos con IA' },
  { key: 'IAB3',  num: 'IA.3',  texto: 'Crear o editar imágenes, audio o videos mediante IA' },
  { key: 'IAI1',  num: 'IA.4',  texto: 'Aprender nuevas habilidades o recibir capacitación asistida por IA' },
  { key: 'IAI2',  num: 'IA.5',  texto: 'Buscar, analizar o sintetizar información especializada mediante IA' },
  { key: 'IAI3',  num: 'IA.6',  texto: 'Automatizar tareas personales, académicas o laborales con IA' },
  { key: 'IAI4',  num: 'IA.7',  texto: 'Traducir o interpretar textos y conversaciones mediante IA' },
  { key: 'IAA1',  num: 'IA.8',  texto: 'Desarrollar, depurar o mejorar código y aplicaciones con asistencia de IA' },
  { key: 'IAA2',  num: 'IA.9',  texto: 'Analizar datos, generar predicciones o apoyar la toma de decisiones con IA' },
  { key: 'IAA3',  num: 'IA.10',  texto: 'Realizar trámites o interactuar con servicios públicos mediante sistemas de IA' },
]

export default function Step5Form({ data, update }: Props) {
  const setPreguntasIA = (key: keyof FormData['preguntasIA'], val: boolean) =>
    update({ preguntasIA: { ...data.preguntasIA, [key]: val } })

  return (
    <div>
      <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        En los últimos 12 meses, ¿utilizaste herramientas o sistemas de inteligencia artificial (ChatGPT, Copilot, Gemini, etc.)  para realizar alguna de las siguientes actividades?
      </p>
      <div>
        {PREGUNTASIA.map((q, i) => (
          <div
            key={q.key}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.9rem 0',
              borderBottom: i < PREGUNTASIA.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
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
                const selected = data.preguntasIA[q.key] === val
                return (
                  <button
                    key={label}
                    onClick={() => setPreguntasIA(q.key, val)}
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