// lib/calculations/InAdCalculation.ts

import { FormData } from '@/types'
import jerarquiaRaw from '@/lib/data/jerarquia_inad.json'
import cursosRaw from '@/lib/data/cursos_p316.json'

// ── ESTRUCTURA DEL JSON (lib/data/jerarquia_inad.json) ────────────────────────
//
// {
//   "año": 2025,
//   "macroregiones": [
//     {
//       "nombre": "CENTRO", "codigo": "M4", "inad": 0.237267,
//       "departamentos": [
//         {
//           "nombre": "ANCASH", "codigo": "02", "inad": 0.24681,
//           "provincias": [
//             {
//               "nombre": "AIJA", "codigo": "0202", "inad": 0.084046,
//               "distritos": [
//                 { "nombre": "CORIS", "codigo": "020202", "inad": 0.065412 }
//               ]
//             }
//           ]
//         }
//       ]
//     }
//   ]
// }

interface JerDistrito  { nombre: string; codigo: string; inad: number; incidencia_H?: number; intensidad_A?: number }
interface JerProvincia { nombre: string; codigo: string; inad: number; incidencia_H?: number; intensidad_A?: number; distritos: JerDistrito[] }
interface JerDep       { nombre: string; codigo: string; inad: number; incidencia_H?: number; intensidad_A?: number; provincias: JerProvincia[] }
interface JerMacro     { nombre: string; codigo: string; inad: number; incidencia_H?: number; intensidad_A?: number; departamentos: JerDep[] }
interface JerRoot      { año: number; inad?: number; macroregiones: JerMacro[] }

const JERARQUIA = jerarquiaRaw as JerRoot

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase()
}

function buscarDepartamento(nombreDep: string): { macro: JerMacro | undefined; dep: JerDep | undefined } {
  const objetivo = normalizar(nombreDep)
  for (const macro of JERARQUIA.macroregiones) {
    const dep = macro.departamentos.find(d => normalizar(d.nombre) === objetivo)
    if (dep) return { macro, dep }
  }
  return { macro: undefined, dep: undefined }
}

function buscarProvincia(dep: JerDep | undefined, nombreProv: string): JerProvincia | undefined {
  if (!dep) return undefined
  const objetivo = normalizar(nombreProv)
  return dep.provincias.find(p => normalizar(p.nombre) === objetivo)
}

function buscarDistrito(prov: JerProvincia | undefined, nombreDist: string): JerDistrito | undefined {
  if (!prov) return undefined
  const objetivo = normalizar(nombreDist)
  return prov.distritos.find(d => normalizar(d.nombre) === objetivo)
}

function calcularInadNacional(): number {
  if (typeof JERARQUIA.inad === 'number') return JERARQUIA.inad
  const macros = JERARQUIA.macroregiones
  if (!macros.length) return 0
  return macros.reduce((acc, m) => acc + m.inad, 0) / macros.length
}

// ── CURSOS P316 desde JSON ────────────────────────────────────────────────────

const P316_KEYS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p12'] as const
type P316Key = typeof P316_KEYS[number]

interface CursoJSON {
  nombre:     string
  plataforma: string
  url:        string
  duracion:   string
}

interface CursoEntradaJSON {
  tema:        string
  descripcion: string
  cursos:      CursoJSON[]
}

const CURSOS_P316 = cursosRaw as Record<P316Key, CursoEntradaJSON>

// ── TIPOS DE SALIDA ───────────────────────────────────────────────────────────

export interface Curso {
  nombre:     string
  plataforma: string
  url:        string
  duracion:   string
}

export interface TemaResultado {
  key:         P316Key
  tema:        string
  descripcion: string
  cursos:      Curso[]
}

export interface ResultadoINAD {
  nombre:          string
  score:           number
  inad:            number
  inad_porcentaje: number
  nivel:           'Novato Digital' | 'Entusiasta Digital' | 'Ciudadano Digital' | 'Productor Digital'
  nivel_color:     string

  ubigeo_departamento: string
  ubigeo_provincia:    string
  ubigeo_distrito:     string
  departamento:        string
  provincia:           string
  distrito:            string
  macroRegion:         string

  inad_ubigeo:       number
  inad_departamento: number
  inad_macroRegion:  number
  inad_nacional:     number

  diff_ubigeo:       number
  diff_departamento: number
  diff_macroRegion:  number
  diff_nacional:     number

  temas_desarrollar: TemaResultado[]
  temas_dominados:   TemaResultado[]
}

// ── FUNCIÓN PRINCIPAL ─────────────────────────────────────────────────────────

export function calcularINAD(form: FormData): ResultadoINAD {

  // 1. Score: contar actividades P316 respondidas Sí
  const score = P316_KEYS.reduce((acc, key) => {
    return acc + (form.p316[key] === true ? 1 : 0)
  }, 0)

  // 2. INAD individual = score / 9
  const inad            = score / 9
  const inad_porcentaje = Math.round(inad * 100)

  // 3. Nivel con colores corporativos
  let nivel:       'Novato Digital' | 'Entusiasta Digital' | 'Ciudadano Digital' | 'Productor Digital'
  let nivel_color: string

  if      (inad < 0.17) { nivel = 'Novato Digital';    nivel_color = '#D36356' }
  else if (inad < 0.5)  { nivel = 'Entusiasta Digital'; nivel_color = '#F58231' }
  else if (inad < 0.83) { nivel = 'Ciudadano Digital';  nivel_color = '#F5C231' }
  else                  { nivel = 'Productor Digital';  nivel_color = '#4A979A' }

  // 4. Búsqueda en cascada: macroregión → departamento → provincia → distrito
  const { macro, dep } = buscarDepartamento(form.departamento)
  const prov = buscarProvincia(dep, form.provincia)
  const dist = buscarDistrito(prov, form.distrito)

  // 5. Códigos ubigeo desde el JSON
  const ubigeo_dep  = dep?.codigo  ?? '00'
  const ubigeo_prov = prov?.codigo ?? '0000'
  const ubigeo_dist = dist?.codigo ?? '000000'

  // 6. Macro región
  const macroRegion = macro?.nombre ?? ''

  // 7. Benchmarks con fallback en cascada distrito → provincia → departamento → nacional
  const bench_ubigeo = dist?.inad ?? prov?.inad ?? dep?.inad ?? calcularInadNacional()
  const bench_dep    = dep?.inad   ?? calcularInadNacional()
  const bench_macro  = macro?.inad ?? calcularInadNacional()
  const bench_nac    = calcularInadNacional()

  const inad_ubigeo = bench_ubigeo
  const inad_dep    = bench_dep
  const inad_macro  = bench_macro
  const inad_nac    = bench_nac

  // 8. Temas según respuesta
  const temas_desarrollar: TemaResultado[] = []
  const temas_dominados:   TemaResultado[] = []

  P316_KEYS.forEach(key => {
    const entrada = CURSOS_P316[key]
    const tema: TemaResultado = {
      key,
      tema:        entrada.tema,
      descripcion: entrada.descripcion,
      cursos:      entrada.cursos,
    }
    if (form.p316[key] === true) temas_dominados.push(tema)
    else                         temas_desarrollar.push(tema)
  })

  // 9. Resultado completo
  return {
    score,
    nombre: form.nombre,
    inad,
    inad_porcentaje,
    nivel,
    nivel_color,

    ubigeo_departamento: ubigeo_dep,
    ubigeo_provincia:    ubigeo_prov,
    ubigeo_distrito:     ubigeo_dist,
    departamento:        form.departamento,
    provincia:           form.provincia,
    distrito:            form.distrito,
    macroRegion,

    inad_ubigeo,
    inad_departamento: inad_dep,
    inad_macroRegion:  inad_macro,
    inad_nacional:     inad_nac,

    diff_ubigeo:       inad - inad_ubigeo,
    diff_departamento: inad - inad_dep,
    diff_macroRegion:  inad - inad_macro,
    diff_nacional:     inad - inad_nac,

    temas_desarrollar,
    temas_dominados,
  }
}