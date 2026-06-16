'use client'
import { FORM_DICTIONARIES } from '@/lib/constants/dictionaries'
import { FormData } from '@/types'
import { OptionGrid, OptionItem } from '@/components/ui/OptionGrid'

interface Props {
  data: FormData
  update: (f: Partial<FormData>) => void
}



export default function Step1Form({ data, update}: Props) {
  return (
    <div>
      <OptionGrid label="Sexo" cols={2}>
        {FORM_DICTIONARIES.sexo.map(option => (
          <OptionItem
            key={option.value}
            label={option.label}
            selected={data.sexo === option.value}
            onClick={() => update({ sexo: option.value })}
          />
        ))}
      </OptionGrid>

      <OptionGrid label="Edad" cols={3}>
        {FORM_DICTIONARIES.edadGrupo.map(group => (
          <OptionItem
            key={group.value}
            label={group.label}
            selected={data.edad === group.value}
            onClick={() => update({ edad: group.value })}
          />
        ))}
      </OptionGrid>

      <OptionGrid label="Lengua materna" cols={3}>
        {FORM_DICTIONARIES.lenguaMaterna.map(option => (
          <OptionItem
            key={option.value}
            label={option.label}
            selected={data.lengua === option.value}
            onClick={() => update({ lengua: option.value })}
          />
        ))}
      </OptionGrid>
    </div>
  )
}