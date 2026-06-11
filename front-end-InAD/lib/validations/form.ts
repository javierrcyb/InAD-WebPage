      // BORRAR O REEMPLAZAR
      
      import { z } from 'zod'

export const step1Schema = z.object({
  sexo:   z.enum(['M', 'F'], { message: 'Selecciona una opción' }),
  edad:   z.string().min(1, 'Selecciona tu rango de edad'),
  lengua: z.string().min(1, 'Selecciona tu lengua materna'),
})

export const step2Schema = z.object({
  educacion: z.string().min(1, 'Selecciona tu nivel educativo'),
  lectura:   z.string().min(1, 'Selecciona tu dominio de lectura'),
  ingreso:   z.string().min(1, 'Selecciona un rango de ingreso'),
})

export const step3Schema = z.object({
  region:       z.enum(['costa', 'sierra', 'selva'], { message: 'Selecciona tu región' }),
  departamento: z.string().min(1, 'Selecciona tu departamento'),
  distrito:     z.string().optional(),
})

export const step4Schema = z.object({
  p316: z.object({
    p1:  z.boolean({ message: 'Responde esta pregunta' }),
    p2:  z.boolean({ message: 'Responde esta pregunta' }),
    p3:  z.boolean({ message: 'Responde esta pregunta' }),
    p4:  z.boolean({ message: 'Responde esta pregunta' }),
    p5:  z.boolean({ message: 'Responde esta pregunta' }),
    p6:  z.boolean({ message: 'Responde esta pregunta' }),
    p7:  z.boolean({ message: 'Responde esta pregunta' }),
    p8:  z.boolean({ message: 'Responde esta pregunta' }),
    p12: z.boolean({ message: 'Responde esta pregunta' }),
  }),
})