// VER QUE HACER CON ESTO


'use client'
import { FormData } from '@/types'
import { OptionGrid, OptionItem } from '@/components/ui/OptionGrid'

interface Props { data: FormData; update: (f: Partial<FormData>) => void }

export default function Step1Perfil({ data, update }: Props) {
  return (
    <div>
      <OptionGrid label="Sexo" cols={2}>
        {(['M','F'] as const).map(v => (
          <OptionItem key={v} label={v === 'M' ? 'Masculino' : 'Femenino'}
            selected={data.sexo === v} onClick={() => update({ sexo: v })} />
        ))}
      </OptionGrid>

      <OptionGrid label="Edad" cols={3}>
        {['18 – 24','25 – 34','35 – 44','45 – 54','55 – 64','65 o más'].map(v => (
          <OptionItem key={v} label={v} selected={data.edad === v} onClick={() => update({ edad: v })} />
        ))}
      </OptionGrid>

      <OptionGrid label="Lengua materna" cols={3}>
        {['Castellano','Quechua','Aimara','Amazónica','Extranjera','Otra'].map(v => (
          <OptionItem key={v} label={v} selected={data.lengua === v} onClick={() => update({ lengua: v })} />
        ))}
      </OptionGrid>
    </div>
  )
}