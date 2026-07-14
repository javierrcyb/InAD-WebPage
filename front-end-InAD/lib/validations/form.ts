//validation/form.s:

import { z } from 'zod'
import { FORM_DICTIONARIES } from '@/lib/constants/dictionaries'

export const telefonoPeruanoSchema = z
  .string()
  .refine(v => v === '' || /^9\d{8}$/.test(v), {
    message: 'Ingresa un número de teléfono válido (9 dígitos, empieza con 9)',
  }).optional()  // permite campo vacío si es opcional

export const emailSchema = z
  .string()
  .email('Ingresa un correo electrónico válido')
  .optional()
  .or(z.literal(''))

const isOneOf = (values: readonly number[], message: string) =>
  z.number().int().refine((value) => values.includes(value), { message })

// ── NUEVO ──
export const step0Schema = z.object({
  nombre:      z.string().min(1, 'El nombre es obligatorio'),
  apellido:    z.string().min(1, 'El apellido es obligatorio'),
  ocupacion:   z.string().min(1, 'La ocupación es obligatoria'),
  institucion: z.string().min(1, 'La institución es obligatoria'),
  telefono:    telefonoPeruanoSchema,
})

export const step1Schema = z.object({
  respondentType: z.enum(['self', 'third_party']),
  sexo:    isOneOf(FORM_DICTIONARIES.sexo.map(o => o.value),          'Selecciona una opción'),
  edad:    isOneOf(FORM_DICTIONARIES.edadGrupo.map(o => o.value),     'Selecciona tu rango de edad'),
  lengua:  isOneOf(FORM_DICTIONARIES.lenguaMaterna.map(o => o.value), 'Selecciona tu lengua materna'),
})

export const step2Schema = z.object({
  nivelEducacion:  isOneOf(FORM_DICTIONARIES.nivelEducacion.map(o => o.value),  'Selecciona tu nivel educativo'),
  dominioLectura:  z.number().int().nullable().optional(),
  ingresoDelHogar: isOneOf(FORM_DICTIONARIES.ingresoDelHogar.map(o => o.value), 'Selecciona un rango de ingreso'),
})

export const step3Schema = z.object({
  departamento: z.string().min(1, 'Selecciona tu departamento'),
  provincia:    z.string().min(1, 'Selecciona tu provincia'),
  distrito:     z.string().min(1, 'Selecciona tu distrito'),
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

export const step5Schema = z.object({
  preguntasIA: z.object({
    IAB1: z.boolean({ message: 'Responde esta pregunta' }),
    IAB2: z.boolean({ message: 'Responde esta pregunta' }),
    IAB3: z.boolean({ message: 'Responde esta pregunta' }),
    IAI1: z.boolean({ message: 'Responde esta pregunta' }),
    IAI2: z.boolean({ message: 'Responde esta pregunta' }),
    IAI3: z.boolean({ message: 'Responde esta pregunta' }),
    IAI4: z.boolean({ message: 'Responde esta pregunta' }),
    IAA1: z.boolean({ message: 'Responde esta pregunta' }),
    IAA2: z.boolean({ message: 'Responde esta pregunta' }),
    IAA3: z.boolean({ message: 'Responde esta pregunta' }),
  }),
})

export const step6Schema = z.object({
  preguntasCiberespacio: z.object({
    CSB1: z.boolean({ message: 'Responde esta pregunta' }),
    CSB2: z.boolean({ message: 'Responde esta pregunta' }),
    CSB3: z.boolean({ message: 'Responde esta pregunta' }),
    CSI1: z.boolean({ message: 'Responde esta pregunta' }),
    CSI2: z.boolean({ message: 'Responde esta pregunta' }),
    CSI3: z.boolean({ message: 'Responde esta pregunta' }),
    CSI4: z.boolean({ message: 'Responde esta pregunta' }),
    CSA1: z.boolean({ message: 'Responde esta pregunta' }),
    CSA2: z.boolean({ message: 'Responde esta pregunta' }),
    CSA3: z.boolean({ message: 'Responde esta pregunta' }),
  }),
})

// step0 va al inicio del array
export const stepSchemas = [
  step0Schema,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  step6Schema,
] as const