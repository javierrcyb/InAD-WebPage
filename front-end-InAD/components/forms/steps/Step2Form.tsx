'use client'
import { FORM_DICTIONARIES } from '@/lib/constants/dictionaries'
import { FormData } from '@/types'
import { OptionGrid, OptionItem } from '@/components/ui/OptionGrid'

interface Props { data: FormData; update: (f: Partial<FormData>) => void }
export default function Step2Form({ data, update }: Props) {
  const isSelf = data.respondentType === 'self'


  return (
    <div>
      <OptionGrid label="Nivel de educación alcanzado" cols={3}>
        {FORM_DICTIONARIES.nivelEducacion.map(option => (
          <OptionItem
            key={option.value}
            label={option.label}
            selected={data.nivelEducacion === option.value}
            onClick={() => update({ nivelEducacion: option.value })}
          />
        ))}
      </OptionGrid>

      {isSelf ? (
        <div style={{
          padding: '1rem 1.2rem',
          borderRadius: 10,
          background: 'rgba(10,58,107,0.04)',
          border: '1px solid rgba(10,58,107,0.08)',
          marginBottom: '1.5rem',
          color: '#6B7280',
          fontSize: '0.875rem',
        }}>
          <strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--navy)' }}>
            Dominio de lectura
          </strong>
          Como estás llenando el formulario tú mismo, asumimos que sabes leer. ✓
        </div>
      ) : (
        <OptionGrid label="Dominio de lectura" cols={2}>
          {FORM_DICTIONARIES.dominioLectura.map(option => (
            <OptionItem
              key={option.value}
              label={option.label}
              selected={data.dominioLectura === option.value}
              onClick={() => update({ dominioLectura: option.value })}
            />
          ))}
        </OptionGrid>
      )}

      <OptionGrid label="Ingreso del hogar" cols={3}>
        {FORM_DICTIONARIES.ingresoDelHogar.map(option => (
          <OptionItem
            key={option.value}
            label={option.label}
            selected={data.ingresoDelHogar === option.value}
            onClick={() => update({ ingresoDelHogar: option.value })}
          />
        ))}
      </OptionGrid>
    </div>
  )
}