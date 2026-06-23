// lib/calculations/InAdCalculation.ts

import { FormData } from '@/types'
import ubigeoRaw from '@/lib/data/ubigeo.json'

// ── MACRO REGIONES ────────────────────────────────────────────────────────────

const MACRO_REGION: Record<string, string> = {
  'Tumbes':        'Norte',   'Piura':         'Norte',
  'Lambayeque':    'Norte',   'La Libertad':   'Norte',
  'Cajamarca':     'Norte',   'Áncash':        'Norte',
  'Lima':          'Centro',  'Callao':        'Centro',
  'Ica':           'Centro',  'Junín':         'Centro',
  'Huancavelica':  'Centro',  'Pasco':         'Centro',
  'Huánuco':       'Centro',
  'Arequipa':      'Sur',     'Moquegua':      'Sur',
  'Tacna':         'Sur',     'Puno':          'Sur',
  'Cusco':         'Sur',     'Apurímac':      'Sur',
  'Ayacucho':      'Sur',
  'Loreto':        'Oriente', 'Ucayali':       'Oriente',
  'San Martín':    'Oriente', 'Amazonas':      'Oriente',
  'Madre de Dios': 'Oriente',
}

// ── BENCHMARKS ────────────────────────────────────────────────────────────────
// Promedios referenciales ENAHO 2022 — actualizar cuando tengas data real

const BENCHMARKS = {
  nacional: 0.44,
  macroRegion: {
    'Norte':   0.41,
    'Centro':  0.52,
    'Sur':     0.43,
    'Oriente': 0.31,
  } as Record<string, number>,
  departamento: {
    'Amazonas':      0.28, 'Áncash':        0.40, 'Apurímac':      0.33,
    'Arequipa':      0.55, 'Ayacucho':      0.34, 'Cajamarca':     0.31,
    'Callao':        0.62, 'Cusco':         0.43, 'Huancavelica':  0.28,
    'Huánuco':       0.33, 'Ica':           0.50, 'Junín':         0.43,
    'La Libertad':   0.43, 'Lambayeque':    0.44, 'Lima':          0.65,
    'Loreto':        0.29, 'Madre de Dios': 0.38, 'Moquegua':      0.52,
    'Pasco':         0.36, 'Piura':         0.41, 'Puno':          0.36,
    'San Martín':    0.37, 'Tacna':         0.56, 'Tumbes':        0.44,
    'Ucayali':       0.35,
  } as Record<string, number>,
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
      { nombre: 'Alfabetización digital',                   plataforma: 'PerúEduca',        url: 'https://www.perueduca.pe',                    duracion: '6 h' },
    ],
  },
  p2: {
    tema: 'Comunicación digital',
    descripcion: 'Domina el correo electrónico, videollamadas y herramientas de colaboración.',
    cursos: [
      { nombre: 'Gmail y Google Meet',                plataforma: 'Google Actívate', url: 'https://learndigital.withgoogle.com/activate', duracion: '3 h' },
      { nombre: 'Comunicación en entornos digitales', plataforma: 'Coursera',        url: 'https://www.coursera.org',                    duracion: '8 h' },
    ],
  },
  p3: {
    tema: 'Compras en línea seguras',
    descripcion: 'Compra de forma segura en tiendas online y marketplaces.',
    cursos: [
      { nombre: 'Compras seguras en internet', plataforma: 'Google Actívate', url: 'https://learndigital.withgoogle.com/activate', duracion: '2 h' },
      { nombre: 'Introducción al e-commerce',  plataforma: 'EDteam',          url: 'https://ed.team',                             duracion: '5 h' },
    ],
  },
  p4: {
    tema: 'Banca electrónica y finanzas digitales',
    descripcion: 'Usa la banca por internet, billeteras digitales y pagos electrónicos.',
    cursos: [
      { nombre: 'Educación financiera digital', plataforma: 'SBS Perú',    url: 'https://www.sbs.gob.pe/educacion-financiera', duracion: '4 h' },
      { nombre: 'Pagos digitales en el Perú',   plataforma: 'YouTube SBS', url: 'https://www.youtube.com/@SBSPeru',            duracion: '2 h' },
    ],
  },
  p5: {
    tema: 'Educación y capacitación en línea',
    descripcion: 'Aprovecha plataformas de e-learning para formarte profesionalmente.',
    cursos: [
      { nombre: 'Aprender a aprender', plataforma: 'Coursera', url: 'https://www.coursera.org/learn/learning-how-to-learn', duracion: '10 h' },
      { nombre: 'Cursos certificados', plataforma: 'EDX',       url: 'https://www.edx.org',                                 duracion: 'Variable' },
    ],
  },
  p6: {
    tema: 'Trámites digitales con el Estado',
    descripcion: 'Realiza trámites en SUNAT, RENIEC, ESSALUD y otros portales del Estado.',
    cursos: [
      { nombre: 'Servicios digitales del Estado', plataforma: 'SERVIR', url: 'https://www.servir.gob.pe', duracion: '3 h' },
      { nombre: 'Trámites en línea paso a paso',  plataforma: 'gob.pe', url: 'https://www.gob.pe',        duracion: '2 h' },
    ],
  },
  p7: {
    tema: 'Entretenimiento y cultura digital',
    descripcion: 'Consume contenido digital de forma segura y crítica.',
    cursos: [
      { nombre: 'Ciudadanía digital',                      plataforma: 'Khan Academy', url: 'https://es.khanacademy.org', duracion: '4 h' },
      { nombre: 'Consumo responsable de medios digitales', plataforma: 'PerúEduca',    url: 'https://www.perueduca.pe',   duracion: '3 h' },
    ],
  },
  p8: {
    tema: 'Venta de productos y servicios en línea',
    descripcion: 'Vende productos online usando marketplaces y redes sociales.',
    cursos: [
      { nombre: 'Vende en línea con Google',       plataforma: 'Google Actívate', url: 'https://learndigital.withgoogle.com/activate',     duracion: '6 h' },
      { nombre: 'Marketing digital para negocios', plataforma: 'Meta Blueprint',  url: 'https://www.facebook.com/business/learn',          duracion: '5 h' },
    ],
  },
  p12: {
    tema: 'Seguridad digital',
    descripcion: 'Protege tu información, evita estafas y mantén tus dispositivos seguros.',
    cursos: [
      { nombre: 'Seguridad en internet', plataforma: 'Google Actívate', url: 'https://learndigital.withgoogle.com/activate', duracion: '4 h' },
      { nombre: 'Ciberseguridad básica', plataforma: 'Cisco NetAcad',   url: 'https://www.netacad.com',                     duracion: '8 h' },
    ],
  },
}

// ── TIPOS DE SALIDA ───────────────────────────────────────────────────────────

export interface TemaResultado {
  key:         P316Key
  tema:        string
  descripcion: string
  cursos:      { nombre: string; plataforma: string; url: string; duracion: string }[]
}

export interface ResultadoINAD {
  // Cálculo principal
  score:           number
  inad:            number          
  inad_porcentaje: number          
  nivel:           'Novato Digital' | 'Entusiasta Digital' | 'Ciudadano Digital' | 'Productor Digital'
  nivel_color:     string

  // Geografía
  ubigeo_departamento: string      
  ubigeo_provincia:    string      
  ubigeo_distrito:     string      
  departamento:        string
  provincia:           string
  distrito:            string
  macroRegion:         string

  // Comparativas (0–100)
  inad_ubigeo:       number
  inad_departamento: number
  inad_macroRegion:  number
  inad_nacional:     number

  // Diferencias vs usuario (positivo = por encima, negativo = por debajo)
  diff_ubigeo:       number
  diff_departamento: number
  diff_macroRegion:  number
  diff_nacional:     number

  // Temas
  temas_desarrollar: TemaResultado[]
  temas_dominados:   TemaResultado[]
}

// ── HELPERS UBIGEO ────────────────────────────────────────────────────────────

interface UbigeoDistrito  { code: string; name: string }
interface UbigeoProvincia { code: string; name: string; districts: UbigeoDistrito[] }
interface UbigeoDep       { code: string; name: string; provinces: UbigeoProvincia[] }

function buscarUbigeo(
  depName:  string,
  provName: string,
  distName: string,
): { ubigeo_dep: string; ubigeo_prov: string; ubigeo_dist: string } {

  const deps = (ubigeoRaw as { departments: UbigeoDep[] }).departments

  const dep  = deps.find(d => d.name.toLowerCase() === depName.toLowerCase())
  if (!dep)  return { ubigeo_dep: '00', ubigeo_prov: '0000', ubigeo_dist: '000000' }

  const prov = dep.provinces.find(p => p.name.toLowerCase() === provName.toLowerCase())
  if (!prov) return { ubigeo_dep: dep.code, ubigeo_prov: '0000', ubigeo_dist: '000000' }

  const dist = prov.districts.find(d => d.name.toLowerCase() === distName.toLowerCase())

  return {
    ubigeo_dep:  dep.code,
    ubigeo_prov: prov.code,
    ubigeo_dist: dist?.code ?? '000000',
  }
}

// ── FUNCIÓN PRINCIPAL ─────────────────────────────────────────────────────────

export function calcularINAD(form: FormData): ResultadoINAD {

  // 1. Score: contar actividades P316 respondidas Sí
  const score = P316_KEYS.reduce((acc, key) => {
    return acc + (form.p316[key] === true ? 1 : 0)
  }, 0)

  // 2. INAD individual = score / 9
  const inad            = score / 9
  const inad_porcentaje = Math.round(inad)

  // 3. Nivel con colores corporativos
  let nivel:       'Novato Digital' | 'Entusiasta Digital' | 'Ciudadano Digital' | 'Productor Digital'
  let nivel_color: string

  if      (inad < 0.17) { nivel = 'Novato Digital';  nivel_color = '#D36356' }
  else if (inad < 0.5) { nivel = 'Entusiasta Digital'; nivel_color = '#F58231' }
  else if (inad < 0.83) { nivel = 'Ciudadano Digital'; nivel_color = '#F5C231' }
  else                  { nivel = 'Productor Digital';  nivel_color = '#4A979A' }

  // 4. Ubigeo desde JSON
  const { ubigeo_dep, ubigeo_prov, ubigeo_dist } = buscarUbigeo(
    form.departamento,
    form.provincia,
    form.distrito,
  )

  // 5. Macro región
  const macroRegion = MACRO_REGION[form.departamento] ?? 'Centro'

  // 6. Benchmarks
  const bench_ubigeo = 1
  const bench_dep   = BENCHMARKS.departamento[form.departamento] ?? BENCHMARKS.nacional
  const bench_macro = BENCHMARKS.macroRegion[macroRegion]        ?? BENCHMARKS.nacional
  const bench_nac   = BENCHMARKS.nacional

  const inad_ubigeo = Math.round(bench_ubigeo)
  const inad_dep   = Math.round(bench_dep)
  const inad_macro = Math.round(bench_macro)
  const inad_nac   = Math.round(bench_nac)

  // 7. Temas según respuesta
  const temas_desarrollar: TemaResultado[] = []
  const temas_dominados:   TemaResultado[] = []

  P316_KEYS.forEach(key => {
    const info = CURSOS_P316[key]
    const tema: TemaResultado = {
      key,
      tema:        info.tema,
      descripcion: info.descripcion,
      cursos:      info.cursos,
    }
    if (form.p316[key] === true) temas_dominados.push(tema)
    else                         temas_desarrollar.push(tema)
  })

  // 8. Resultado completo
  return {
    score,
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
    macroRegion:         form.departamento ? (MACRO_REGION[form.departamento] ?? 'Centro') : 'Centro',

    inad_ubigeo:       inad_ubigeo,
    inad_departamento: inad_dep,
    inad_macroRegion:  inad_macro,
    inad_nacional:     inad_nac,


    diff_ubigeo:       inad_porcentaje - inad_ubigeo,
    diff_departamento: inad_porcentaje - inad_dep,
    diff_macroRegion:  inad_porcentaje - inad_macro,
    diff_nacional:     inad_porcentaje - inad_nac,

    temas_desarrollar,
    temas_dominados,
  }
}