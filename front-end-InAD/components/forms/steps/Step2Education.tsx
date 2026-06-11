// VER QUE HACER CON ESTO


'use client'
import { FormData } from '@/types'
import { OptionGrid, OptionItem } from '@/components/ui/OptionGrid'

interface Props { data: FormData; update: (f: Partial<FormData>) => void }

export default function Step2Educacion({ data, update }: Props) {
  return (
    <div>
      <OptionGrid label="Nivel de educación alcanzado" cols={2}>
        {['Sin nivel','Primaria','Secundaria','Técnica / Superior no universitaria','Universitaria','Posgrado'].map(v => (
          <OptionItem key={v} label={v} selected={data.educacion === v} onClick={() => update({ educacion: v })} />
        ))}
      </OptionGrid>

      <OptionGrid label="Dominio de lectura" cols={2}>
        {['No sé leer ni escribir','Leo con dificultad','Leo con fluidez','Leo y comprendo textos complejos'].map(v => (
          <OptionItem key={v} label={v} selected={data.lectura === v} onClick={() => update({ lectura: v })} />
        ))}
      </OptionGrid>

      <OptionGrid label="Ingreso mensual del hogar (soles)" cols={2}>
        {['Menos de S/ 930','S/ 930 – 1,500','S/ 1,500 – 3,000','S/ 3,000 – 5,000','Más de S/ 5,000','Prefiero no indicar'].map(v => (
          <OptionItem key={v} label={v} selected={data.ingreso === v} onClick={() => update({ ingreso: v })} />
        ))}
      </OptionGrid>
    </div>
  )
}