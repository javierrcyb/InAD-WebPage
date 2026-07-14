// lib/calculations/InAdCalculation.ts

import { FormData } from '@/types'
import jerarquiaRaw from '@/lib/data/jerarquia_inad.json'

// ── ESTRUCTURA DEL JSON (lib/data/jerarquia_inad.json) ────────────────────────
//
// {
//   "año": 2025,
//   "macroregiones": [
//     {
//       "nombre": "CENTRO", "codigo": "M4", "inad": 0.237267,
//       "incidencia_H": 0.765216, "intensidad_A": 0.310066,
//       "departamentos": [
//         {
//           "nombre": "ANCASH", "codigo": "02", "inad": 0.24681,
//           "incidencia_H": 0.784113, "intensidad_A": 0.314763,
//           "provincias": [
//             {
//               "nombre": "AIJA", "codigo": "0202", "inad": 0.084046,
//               "incidencia_H": 0.404418, "intensidad_A": 0.20782,
//               "distritos": [
//                 {
//                   "nombre": "CORIS", "codigo": "020202", "inad": 0.065412,
//                   "incidencia_H": 0.366802, "intensidad_A": 0.178332
//                 }
//               ]
//             }
//           ]
//         }
//       ]
//     }
//   ]
// }

interface JerDistrito { nombre: string; codigo: string; inad: number; incidencia_H?: number; intensidad_A?: number }
interface JerProvincia { nombre: string; codigo: string; inad: number; incidencia_H?: number; intensidad_A?: number; distritos: JerDistrito[] }
interface JerDep { nombre: string; codigo: string; inad: number; incidencia_H?: number; intensidad_A?: number; provincias: JerProvincia[] }
interface JerMacro { nombre: string; codigo: string; inad: number; incidencia_H?: number; intensidad_A?: number; departamentos: JerDep[] }
interface JerRoot { año: number; inad?: number; macroregiones: JerMacro[] }

const JERARQUIA = jerarquiaRaw as JerRoot

// Los nombres en el JSON vienen en MAYÚSCULAS y sin tildes (ej. "ANCASH", "JUNIN").
// Los del formulario vienen con tildes y capitalización normal (ej. "Áncash", "Junín").
// Esta función normaliza ambos lados para poder compararlos.
function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita tildes
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

// Promedio nacional: usa el campo raíz "inad" si existe, si no promedia las macroregiones.
function calcularInadNacional(): number {
  if (typeof JERARQUIA.inad === 'number') return JERARQUIA.inad
  const macros = JERARQUIA.macroregiones
  if (!macros.length) return 0
  const suma = macros.reduce((acc, m) => acc + m.inad, 0)
  return suma / macros.length
}

// ── CURSOS POR ACTIVIDAD P316 ─────────────────────────────────────────────────

const P316_KEYS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p12'] as const
type P316Key = typeof P316_KEYS[number]

const CURSOS_P316: Record<P316Key, {
  tema: string
  descripcion: string
  cursos: { nombre: string; plataforma: string; url: string; duracion: string }[]
}> = {
  p1: {
    tema: 'Búsqueda y evaluación de información',
    descripcion: 'Aprende a buscar, filtrar y verificar información confiable en internet.',
    cursos: [
      { nombre: 'Habilidades digitales para principiantes', plataforma: 'Google Actívate', url: 'https://learndigital.withgoogle.com/activate', duracion: '4 h' },
      { nombre: 'Alfabetización digital', plataforma: 'PerúEduca', url: 'https://www.perueduca.pe', duracion: '6 h' },
    ],
  },
  p2: {
    tema: 'Comunicación digital',
    descripcion: 'Domina el correo electrónico, videollamadas y herramientas de colaboración.',
    cursos: [
      { nombre: 'Gmail y Google Meet', plataforma: 'Google Actívate', url: 'https://learndigital.withgoogle.com/activate', duracion: '3 h' },
      { nombre: 'Comunicación en entornos digitales', plataforma: 'Coursera', url: 'https://www.coursera.org', duracion: '8 h' },
    ],
  },
  p3: {
    tema: 'Compras en línea seguras',
    descripcion: 'Compra de forma segura en tiendas online y marketplaces.',
    cursos: [
      { nombre: 'Compras seguras en internet', plataforma: 'Google Actívate', url: 'https://learndigital.withgoogle.com/activate', duracion: '2 h' },
      { nombre: 'Introducción al e-commerce', plataforma: 'EDteam', url: 'https://ed.team', duracion: '5 h' },
    ],
  },
  p4: {
    tema: 'Banca electrónica y finanzas digitales',
    descripcion: 'Usa la banca por internet, billeteras digitales y pagos electrónicos.',
    cursos: [
      { nombre: 'Educación financiera digital', plataforma: 'SBS Perú', url: 'https://www.sbs.gob.pe/educacion-financiera', duracion: '4 h' },
      { nombre: 'Pagos digitales en el Perú', plataforma: 'YouTube SBS', url: 'https://www.youtube.com/@SBSPeru', duracion: '2 h' },
    ],
  },
  p5: {
    tema: 'Educación y capacitación en línea',
    descripcion: 'Aprovecha plataformas de e-learning para formarte profesionalmente.',
    cursos: [
      { nombre: 'Aprender a aprender', plataforma: 'Coursera', url: 'https://www.coursera.org/learn/learning-how-to-learn', duracion: '10 h' },
      { nombre: 'Cursos certificados', plataforma: 'EDX', url: 'https://www.edx.org', duracion: 'Variable' },
    ],
  },
  p6: {
    tema: 'Trámites digitales con el Estado',
    descripcion: 'Realiza trámites en SUNAT, RENIEC, ESSALUD y otros portales del Estado.',
    cursos: [
      { nombre: 'Servicios digitales del Estado', plataforma: 'SERVIR', url: 'https://www.servir.gob.pe', duracion: '3 h' },
      { nombre: 'Trámites en línea paso a paso', plataforma: 'gob.pe', url: 'https://www.gob.pe', duracion: '2 h' },
    ],
  },
  p7: {
    tema: 'Entretenimiento y cultura digital',
    descripcion: 'Consume contenido digital de forma segura y crítica.',
    cursos: [
      { nombre: 'Ciudadanía digital', plataforma: 'Khan Academy', url: 'https://es.khanacademy.org', duracion: '4 h' },
      { nombre: 'Consumo responsable de medios digitales', plataforma: 'PerúEduca', url: 'https://www.perueduca.pe', duracion: '3 h' },
    ],
  },
  p8: {
    tema: 'Venta de productos y servicios en línea',
    descripcion: 'Vende productos online usando marketplaces y redes sociales.',
    cursos: [
      { nombre: 'Vende en línea con Google', plataforma: 'Google Actívate', url: 'https://learndigital.withgoogle.com/activate', duracion: '6 h' },
      { nombre: 'Marketing digital para negocios', plataforma: 'Meta Blueprint', url: 'https://www.facebook.com/business/learn', duracion: '5 h' },
    ],
  },
  p12: {
    tema: 'Seguridad digital',
    descripcion: 'Protege tu información, evita estafas y mantén tus dispositivos seguros.',
    cursos: [
      { nombre: 'Seguridad en internet', plataforma: 'Google Actívate', url: 'https://learndigital.withgoogle.com/activate', duracion: '4 h' },
      { nombre: 'Ciberseguridad básica', plataforma: 'Cisco NetAcad', url: 'https://www.netacad.com', duracion: '8 h' },
    ],
  },
}

// ── TIPOS DE SALIDA ───────────────────────────────────────────────────────────

export interface TemaResultado {
  key: P316Key
  tema: string
  descripcion: string
  cursos: { nombre: string; plataforma: string; url: string; duracion: string }[]
}

export interface ResultadoINAD {
  nombre: string
  score: number
  inad: number
  inad_porcentaje: number
  nivel: 'Novato Digital' | 'Entusiasta Digital' | 'Ciudadano Digital' | 'Productor Digital'
  nivel_color: string

  // Geografía (códigos tomados directamente del JSON)
  ubigeo_departamento: string
  ubigeo_provincia: string
  ubigeo_distrito: string
  departamento: string
  provincia: string
  distrito: string
  macroRegion: string

  // Comparativas (0–100)
  inad_ubigeo: number
  inad_departamento: number
  inad_macroRegion: number
  inad_nacional: number

  // Diferencias vs usuario (positivo = por encima, negativo = por debajo)
  diff_ubigeo: number
  diff_departamento: number
  diff_macroRegion: number
  diff_nacional: number

  temas_desarrollar: TemaResultado[]
  temas_dominados: TemaResultado[]
}

// ── FUNCIÓN PRINCIPAL ─────────────────────────────────────────────────────────

export function calcularINAD(form: FormData): ResultadoINAD {

  // 1. Score: contar actividades P316 respondidas Sí
  const score = P316_KEYS.reduce((acc, key) => {
    return acc + (form.p316[key] === true ? 1 : 0)
  }, 0)

  // 2. INAD individual = score / 9
  const inad = score / 9
  const inad_porcentaje = Math.round(inad * 100)

  // 3. Nivel con colores corporativos
  let nivel: 'Novato Digital' | 'Entusiasta Digital' | 'Ciudadano Digital' | 'Productor Digital'
  let nivel_color: string

  if (inad < 0.17) { nivel = 'Novato Digital'; nivel_color = '#D36356' }
  else if (inad < 0.5) { nivel = 'Entusiasta Digital'; nivel_color = '#F58231' }
  else if (inad < 0.83) { nivel = 'Ciudadano Digital'; nivel_color = '#F5C231' }
  else { nivel = 'Productor Digital'; nivel_color = '#4A979A' }

  // 4. Búsqueda en cascada dentro de jerarquia_inad.json:
  //    macroregión → departamento → provincia → distrito
  const { macro, dep } = buscarDepartamento(form.departamento)
  const prov = buscarProvincia(dep, form.provincia)
  const dist = buscarDistrito(prov, form.distrito)

  // 5. Códigos ubigeo tomados directamente del JSON (no hay archivo separado)
  const ubigeo_dep = dep?.codigo ?? '00'
  const ubigeo_prov = prov?.codigo ?? '0000'
  const ubigeo_dist = dist?.codigo ?? '000000'

  // 6. Macro región: nombre tal como aparece en el JSON
  const macroRegion = macro?.nombre ?? ''

  // 7. Benchmarks: el inad más específico disponible para "mi ubigeo",
  //    con fallback en cascada distrito → provincia → departamento → nacional
  const bench_ubigeo = dist?.inad ?? prov?.inad ?? dep?.inad ?? calcularInadNacional()
  const bench_dep = dep?.inad ?? calcularInadNacional()
  const bench_macro = macro?.inad ?? calcularInadNacional()
  const bench_nac = calcularInadNacional()

  // Los valores del JSON vienen como fracción (0–1); se expresan en escala 0–100
  // para que sean comparables con inad_porcentaje.
  const inad_ubigeo = bench_ubigeo
  const inad_dep = bench_dep
  const inad_macro = bench_macro
  const inad_nac = bench_nac

  // 8. Temas según respuesta
  const temas_desarrollar: TemaResultado[] = []
  const temas_dominados: TemaResultado[] = []

  P316_KEYS.forEach(key => {
    const info = CURSOS_P316[key]
    const tema: TemaResultado = {
      key,
      tema: info.tema,
      descripcion: info.descripcion,
      cursos: info.cursos,
    }
    if (form.p316[key] === true) temas_dominados.push(tema)
    else temas_desarrollar.push(tema)
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
    ubigeo_provincia: ubigeo_prov,
    ubigeo_distrito: ubigeo_dist,
    departamento: form.departamento,
    provincia: form.provincia,
    distrito: form.distrito,
    macroRegion,

    inad_ubigeo: inad_ubigeo,
    inad_departamento: inad_dep,
    inad_macroRegion: inad_macro,
    inad_nacional: inad_nac,

    diff_ubigeo: inad - inad_ubigeo,
    diff_departamento: inad - inad_dep,
    diff_macroRegion: inad - inad_macro,
    diff_nacional: inad - inad_nac,

    temas_desarrollar,
    temas_dominados,
  }
}