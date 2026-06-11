// BORRAR O CAMBIAR

export type Sexo = 'M' | 'F'
export type Region = 'costa' | 'sierra' | 'selva'

export interface FormData {
  // Paso 1 — Perfil
  sexo: Sexo | ''
  edad: string
  lengua: string
  // Paso 2 — Educación e ingresos
  educacion: string
  lectura: string
  ingreso: string
  // Paso 3 — Ubicación
  region: Region | ''
  departamento: string
  distrito: string
  // Paso 4 — P316
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
  sexo: '', edad: '', lengua: '',
  educacion: '', lectura: '', ingreso: '',
  region: '', departamento: '', distrito: '',
  p316: { p1: null, p2: null, p3: null, p4: null, p5: null, p6: null, p7: null, p8: null, p12: null },
}