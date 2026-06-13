// VER QUE HACER CON ESTO


'use client'
import { FORM_DICTIONARIES } from '@/lib/constants/dictionaries'
import { FormData } from '@/types'
import { OptionGrid, OptionItem } from '@/components/ui/OptionGrid'

interface Props { data: FormData; update: (f: Partial<FormData>) => void }
export default function Step2Form({ data, update }: Props) {
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