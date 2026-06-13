// BORRAR O CAMBIAR

import { FORM_DICTIONARIES } from "@/lib/constants/dictionaries"

type OptionValue<T extends readonly { value: number }[]> = T[number]['value']

// FORM SECCION 1-> PERFIL PERSONAL
export type Sexo = OptionValue<typeof FORM_DICTIONARIES.sexo>
export type EdadGrupo = OptionValue<typeof FORM_DICTIONARIES.edadGrupo>
export type LenguaMaterna = OptionValue<typeof FORM_DICTIONARIES.lenguaMaterna>
export type Region = 1 | 2 | 3

// FORM SECCION 2-> EDUCACIÓN E INGRESOS
export type NivelEducacion = OptionValue<typeof FORM_DICTIONARIES.nivelEducacion>
export type DominioLectura = OptionValue<typeof FORM_DICTIONARIES.dominioLectura>
export type IngresoDelHogar = OptionValue<typeof FORM_DICTIONARIES.ingresoDelHogar>

export interface FormData {
  // Paso 1 -> Perfil
  sexo: Sexo | null
  edad: EdadGrupo | null
  lengua: LenguaMaterna | null
  // Paso 2 -> Educación e ingresos
  nivelEducacion: NivelEducacion | null
  dominioLectura: DominioLectura | null
  ingresoDelHogar: IngresoDelHogar | null
  // Paso 3 -> Ubicación
  region: Region | ''
  departamento: string
  provincia: string
  distrito: string
  // Paso 4 -> P316
  p316: {
    p1:  boolean | null   // Obtener información
    p2:  boolean | null   // Comunicarse
    p3:  boolean | null   // Comprar productos/servicios
    p4:  boolean | null   // Banca electrónica
    p5:  boolean | null   // Educación/capacitación
    p6:  boolean | null   // Trámites con el Estado
    p7:  boolean | null   // Entretenimiento
    p8:  boolean | null   // Vender productos/servicios
    p12: boolean | null   // Descarga antivirus/software
  }
}

export const INITIAL_FORM: FormData = {
  sexo: null, edad: null, lengua: null,
  nivelEducacion: null, dominioLectura: null, ingresoDelHogar: null,
  region: '', departamento: '', provincia: '', distrito: '',
  p316: { p1: null, p2: null, p3: null, p4: null, p5: null, p6: null, p7: null, p8: null, p12: null },
}