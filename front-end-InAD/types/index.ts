// types/index.ts

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

export type RespondentType = 'self' | 'third_party'

export interface FormData {
  // Paso 0 -> Datos personales
  nombre:      string
  apellido:    string
  ocupacion:   string
  institucion: string
  telefono:    string

  // Paso 1 -> Perfil
  respondentType: RespondentType | null
  sexo:           Sexo | null
  edad:           EdadGrupo | null
  lengua:         LenguaMaterna | null
  otrasLenguas:   LenguaMaterna[]

  // Paso 2 -> Educación e ingresos
  nivelEducacion:  NivelEducacion | null
  dominioLectura:  DominioLectura | null
  ingresoDelHogar: IngresoDelHogar | null

  // Paso 3 -> Ubicación
  region:       Region | ''
  departamento: string
  provincia:    string
  distrito:     string

  // Paso 4 -> P316
  p316: {
    p1:  boolean | null
    p2:  boolean | null
    p3:  boolean | null
    p4:  boolean | null
    p5:  boolean | null
    p6:  boolean | null
    p7:  boolean | null
    p8:  boolean | null
    p12: boolean | null
  }

  // Paso 5 -> BLOQUE INTELIGENCIA ARTIFICIAL
  preguntasIA: {
    IAB1: boolean | null
    IAB2: boolean | null
    IAB3: boolean | null
    IAI1: boolean | null
    IAI2: boolean | null
    IAI3: boolean | null
    IAI4: boolean | null
    IAA1: boolean | null
    IAA2: boolean | null
    IAA3: boolean | null
  }

  // Paso 6 -> BLOQUE CIBERESPACIO
  preguntasCiberespacio: {
    CSB1: boolean | null
    CSB2: boolean | null
    CSB3: boolean | null
    CSI1: boolean | null
    CSI2: boolean | null
    CSI3: boolean | null
    CSI4: boolean | null
    CSA1: boolean | null
    CSA2: boolean | null
    CSA3: boolean | null
  }

  // Paso 6 -> Consentimientos (al final del formulario)
  boletinNeurometrics: boolean   // opcional
  aceptaAliados:       boolean   // opcional
  tratamientoDatos:    boolean   // obligatorio
}

export const INITIAL_FORM: FormData = {
  nombre: '', apellido: '', ocupacion: '', institucion: '', telefono: '',
  respondentType: null,
  sexo: null, edad: null, lengua: null, otrasLenguas: [],
  nivelEducacion: null, dominioLectura: null, ingresoDelHogar: null,
  region: '', departamento: '', provincia: '', distrito: '',
  p316: { p1: null, p2: null, p3: null, p4: null, p5: null, p6: null, p7: null, p8: null, p12: null },
  preguntasIA: { IAB1: null, IAB2: null, IAB3: null, IAI1: null, IAI2: null, IAI3: null, IAI4: null, IAA1: null, IAA2: null, IAA3: null },
  preguntasCiberespacio: { CSB1: null, CSB2: null, CSB3: null, CSI1: null, CSI2: null, CSI3: null, CSI4: null, CSA1: null, CSA2: null, CSA3: null },
  boletinNeurometrics: false,
  aceptaAliados:       false,
  tratamientoDatos:    false,
}