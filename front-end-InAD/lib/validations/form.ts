// BORRAR O REEMPLAZAR
      
import { z } from 'zod'
import { FORM_DICTIONARIES } from '@/lib/constants/dictionaries'

const isOneOf = (values: readonly number[], message: string) =>
  z.number().int().refine((value) => values.includes(value), { message })

export const step1Schema = z.object({
  sexo: isOneOf(FORM_DICTIONARIES.sexo.map((option) => option.value), 'Selecciona una opción'),
  edad: isOneOf(FORM_DICTIONARIES.edadGrupo.map((option) => option.value), 'Selecciona tu rango de edad'),
  lengua: isOneOf(FORM_DICTIONARIES.lenguaMaterna.map((option) => option.value), 'Selecciona tu lengua materna'),
})

export const step2Schema = z.object({
  nivelEducacion: isOneOf(FORM_DICTIONARIES.nivelEducacion.map((option) => option.value), 'Selecciona tu nivel educativo'),
  dominioLectura: isOneOf(FORM_DICTIONARIES.dominioLectura.map((option) => option.value), 'Selecciona tu dominio de lectura'),
  ingresoDelHogar: isOneOf(FORM_DICTIONARIES.ingresoDelHogar.map((option) => option.value), 'Selecciona un rango de ingreso'),
})

export const step3Schema = z.object({
  departamento: z.string().min(1, 'Selecciona tu departamento'),
  provincia: z.string().min(1, 'Selecciona tu provincia'),
  distrito: z.string().min(1, 'Selecciona tu distrito'),
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

export const stepSchemas = [step1Schema, step2Schema, step3Schema, step4Schema] as const