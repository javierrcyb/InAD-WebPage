import React from 'react'
import {
  Document, Page, View, Text, StyleSheet, Link, Image,
} from '@react-pdf/renderer'
import { ResultadoINAD } from '@/lib/calculations/InAdCalculation'
import type { DocumentProps } from '@react-pdf/renderer'

// ── Colores corporativos ──────────────────────────────────────────
const C = {
  navy: '#0A3A6B',
  orange: '#F58231',
  teal: '#4A979A',
  coral: '#D36356',
  gray: '#6B7280',
  light: '#F5F4F0',
  border: '#E8E7E3',
  white: '#FFFFFF',
}

// ── Niveles ───────────────────────────────────────────────────────
const NIVELES = [
  { label: 'Novato Digital',      min: 0,    max: 0.17, color: C.coral  },
  { label: 'Entusiasta Digital',  min: 0.17, max: 0.50, color: C.orange },
  { label: 'Ciudadano Digital',   min: 0.50, max: 0.83, color: C.teal   },
  { label: 'Productor Digital',   min: 0.83, max: 1.00, color: C.navy   },
]

function getNivelColor(inad: number) {
  if (inad < 0.17) return C.coral
  if (inad < 0.50) return C.orange
  if (inad < 0.83) return C.teal
  return C.navy
}

// ── Estilos ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    backgroundColor: C.white,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1A1A2E',
  },

  // Header — SOLO nombre, correo, fecha (sin ubicación)
  header: {
    backgroundColor: C.navy,
    borderBottomWidth: 3,
    borderBottomColor: C.orange,
    paddingTop: 14,
    paddingRight: 36,
    paddingBottom: 10,
    marginBottom: 25,
    paddingLeft: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerEyebrow: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: C.orange,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    marginBottom: 2,
  },
  headerSub: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.6)',
  },
  headerMetaWrap: {
    alignItems: 'flex-end',
  },
  headerMetaItem: {
    fontSize: 8,
    color: C.white,
    padding: '2 8',
    marginBottom: 3,
  },
  headerMetaName: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    padding: '2 8',
    marginBottom: 3,
  },

  // Footer
  footer: {
    backgroundColor: C.navy,
    padding: '0 36',
    height: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 7.5,
    color: C.white,
  },

  // Contenido
  content: {
    padding: '28 36',
    flex: 1,
  },

  sep: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 16,
  },

  eyebrow: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: C.coral,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  eyebrowTeal:  { color: C.teal  },
  eyebrowCoral: { color: C.coral },

  secTitulo: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: C.navy,
    marginBottom: 10,
  },

  // ── BLOQUE 1: Score ──
  scoreNum: {
    fontSize: 52,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    lineHeight: 1,
  },
  scoreDenom: {
    fontSize: 20,
    color: '#CCC',
  },
  nivelBadge: {
    borderRadius: 100,
    paddingVertical: 3,
    paddingHorizontal: 14,
    alignSelf: 'center',
    marginTop: 6,
  },
  nivelBadgeText: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
  },
  scoreDesc: {
    fontSize: 10,
    color: C.gray,
    textAlign: 'center',
    marginTop: 6,
  },

  // Barra de niveles
  barraWrap: {
    marginTop: 14,
    marginHorizontal: 20,
  },
  barraSegmentos: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    gap: 1,
  },
  barraEscala: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  barraEscalaNum: {
    fontSize: 7,
    color: '#999',
  },
  barraLabels: {
    flexDirection: 'row',
    marginTop: 3,
  },
  barraLabelItem: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },

  // ── BLOQUE 2: Comparativa (zoom tree) ──
  treeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  treeLine: {
    width: 1.5,
    backgroundColor: '#F0EFEB',
    alignSelf: 'stretch',
    marginRight: 0,
  },
  treeDotWrap: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  treeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: C.white,
  },
  treeCard: {
    flex: 1,
    borderRadius: 8,
    padding: '7 10',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
    borderWidth: 0.5,
  },
  treeCardLeft: {
    flex: 1,
  },
  treeCardLabel: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: '#bbb',
  },
  treeCardPlace: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    marginTop: 2,
  },
  treeCardRight: {
    alignItems: 'flex-end',
  },
  treeCardVal: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1,
  },
  treeCardDiff: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    borderRadius: 100,
    paddingVertical: 2,
    paddingHorizontal: 5,
    marginTop: 3,
  },

  // ── BLOQUE 3: Temas a desarrollar ──
  temaWrap: {
    borderLeftWidth: 3,
    borderLeftColor: C.coral,
    paddingLeft: 10,
    marginBottom: 14,
  },
  temaTitulo: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: C.navy,
    marginBottom: 3,
  },
  temaDesc: {
    fontSize: 9,
    color: C.gray,
    lineHeight: 1.6,
    marginBottom: 6,
  },
  cursosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  cursoCard: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 8,
    padding: '5 9',
    backgroundColor: C.light,
    minWidth: 130,
  },
  cursoNombre: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: C.navy,
  },
  cursoPlat: {
    fontSize: 7.5,
    color: C.teal,
    marginTop: 1,
  },

  // ── BLOQUE 4: Dominados ──
  dominadoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: '7 10',
    backgroundColor: 'rgba(74,151,154,0.07)',
    borderLeftWidth: 3,
    borderLeftColor: C.teal,
    borderRadius: 4,
    marginBottom: 5,
  },
  dominadoCheck: {
    fontSize: 10,
    color: C.teal,
    fontFamily: 'Helvetica-Bold',
  },
  dominadoLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: C.navy,
  },

  // Ubigeo (detalle geográfico)
  ubigeoRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  ubigeoCell: {
    flex: 1,
    padding: '8 10',
    backgroundColor: C.light,
    borderRightWidth: 1,
    borderRightColor: C.border,
  },
  ubigeoCellLast: { borderRightWidth: 0 },
  ubigeoLbl: {
    fontSize: 7,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Helvetica-Bold',
  },
  ubigeoVal: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: C.navy,
    marginTop: 2,
  },
})

// ── Sub-componentes ───────────────────────────────────────────────

/**
 * Header: nombre (bold) → correo → fecha. Sin ubicación.
 */
function Header({ email, fecha, nombre }: { email: string; fecha: string; nombre: string }) {
  return (
    <View style={s.header} fixed>
      {/* Lado izquierdo: branding + título */}
      <View>
        <Text style={s.headerEyebrow}>Índice de Actividad Digital</Text>
        <Text style={s.headerTitle}>Reporte INAD Personal</Text>
      </View>

      {/* Lado derecho: nombre, correo, fecha */}
      <View style={s.headerMetaWrap}>
        <Text style={s.headerMetaName}>{nombre}</Text>
        <Text style={s.headerMetaItem}>{email}</Text>
        <Text style={s.headerMetaItem}>{fecha}</Text>
      </View>
    </View>
  )
}

function Footer({ fecha, email }: { fecha: string; email: string }) {
  return (
    <View style={s.footer} fixed>
       <Link src="https://neurometrics.la/" style={{ textDecoration: 'none' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6}}>
            <Image
              src="lib\data\Logo Neurometrics blanco.png"  // ← reemplaza con la URL real del logo
              style={{height: 10 }}
            />
          </View>
        </Link> 
      <Text style={[s.footerText, { fontFamily: 'Helvetica-Bold' }]}>INAD · Índice de Actividad Digital</Text>

    </View>
  )
}

function BarraNiveles({ inad }: { inad: number }) {
  const nivelColor = getNivelColor(inad)
  return (
    <View style={s.barraWrap}>
      {/* Segmentos coloreados */}
      <View style={s.barraSegmentos}>
        {NIVELES.map((n, i) => (
          <View
            key={n.label}
            style={{
              flex: (n.max - n.min),
              height: 8,
              backgroundColor: n.color,
              opacity: 0.3,
              borderRadius: i === 0 ? 4 : i === NIVELES.length - 1 ? 4 : 0,
            }}
          />
        ))}
      </View>

      {/* Marcador circular */}
      <View style={{ position: 'relative', height: 10, marginTop: -9 }}>
        <View style={{
          position: 'absolute',
          left: `${inad * 100}%`,
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: nivelColor,
          borderWidth: 2,
          borderColor: C.white,
          marginLeft: -5,
        }} />
      </View>

      {/* Escala numérica */}
      <View style={s.barraEscala}>
        {[0, 0.17, 0.50, 0.83, 1].map(v => (
          <Text key={v} style={s.barraEscalaNum}>
            {v === 0 ? '0' : v === 1 ? '1' : v.toFixed(2)}
          </Text>
        ))}
      </View>

      {/* Etiquetas de nivel */}
      <View style={s.barraLabels}>
        {NIVELES.map(n => (
          <View key={n.label} style={{ flex: (n.max - n.min) }}>
            <Text style={[s.barraLabelItem, { color: n.color }]}>{n.label}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

/**
 * Fila del árbol de comparativa geográfica.
 * Replica el diseño de indentación + dot + card de ResultadoBlock.
 */
function ComparativaTreeItem({
  name, place, promedio, diff, color, depth,
}: {
  name: string; place: string; promedio: number; diff: number; color: string; depth: number
}) {
  const pos = diff >= 0
  return (
    <View style={{ flexDirection: 'row', alignItems: 'stretch', marginBottom: 4 }}>
      {/* Líneas de niveles anteriores */}
      {Array.from({ length: depth }, (_, j) => (
        <View key={j} style={{ width: 20, position: 'relative' }}>
          <View style={{
            position: 'absolute', left: 10, top: 0, bottom: 0,
            width: 1.5, backgroundColor: '#F0EFEB',
          }} />
        </View>
      ))}

      {/* Columna del nivel actual: línea vertical + dot */}
      <View style={{ width: 20, position: 'relative' }}>
        {depth < 3 && (
          <View style={{
            position: 'absolute', left: 10, top: 0, bottom: 0,
            width: 1.5, backgroundColor: '#F0EFEB',
          }} />
        )}
        <View style={{
          position: 'absolute', left: 5, top: '50%',
          width: 10, height: 10, borderRadius: 5,
          backgroundColor: color,
          borderWidth: 2, borderColor: C.white,
        }} />
      </View>

      {/* Card de datos */}
      <View style={[s.treeCard, {
        borderColor: color + '30',
        backgroundColor: color + '0D',
      }]}>
        <View style={s.treeCardLeft}>
          <Text style={s.treeCardLabel}>{name}</Text>
          <Text style={[s.treeCardPlace, { color }]}>{place}</Text>
        </View>
        <View style={s.treeCardRight}>
          <Text style={[s.treeCardVal, { color }]}>{promedio.toFixed(2)}</Text>
          <Text style={[s.treeCardDiff, {
            color: pos ? '#0F6E56' : C.coral,
            backgroundColor: pos ? 'rgba(74,151,154,0.12)' : 'rgba(211,99,86,0.12)',
          }]}>
            {pos ? `+${diff.toFixed(2)}` : diff.toFixed(2)} vs tú
          </Text>
        </View>
      </View>
    </View>
  )
}

// ── Documento principal ───────────────────────────────────────────

type Props = { resultado: ResultadoINAD; email: string }

export function ReportePDF({ resultado, email }: Props): React.ReactElement<DocumentProps> {
  const r = resultado
  const fecha = new Date().toLocaleDateString('es-PE', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  const nivelColor = getNivelColor(r.inad)

  const comparativaItems = [
    { name: 'Nacional',     place: 'Perú',        promedio: r.inad_nacional,     diff: r.diff_nacional,     color: '#0A3A6B' },
    { name: 'Macro región', place: r.macroRegion,  promedio: r.inad_macroRegion,  diff: r.diff_macroRegion,  color: '#4A979A' },
    { name: 'Departamento', place: r.departamento, promedio: r.inad_departamento, diff: r.diff_departamento, color: '#185FA5' },
    { name: 'Distrito',     place: r.distrito,     promedio: r.inad_ubigeo,       diff: r.diff_ubigeo,       color: '#F58231' },
  ]

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* Header y Footer intactos — solo nombre/email/fecha */}
        <Header email={email} fecha={fecha} nombre={r.nombre} />

        <View style={s.content}>
<View style={{ flex: 1, justifyContent: 'center' }}>
          {/* ── BLOQUE 1: Score + barra de niveles ── */}
          <View style={{ marginTop: -32 }}>
            <Text style={s.eyebrow}>Tu resultado INAD</Text>

            <Text style={[s.scoreNum, { color: nivelColor, marginTop: 8 }]}>
              {r.inad.toFixed(2)}
              <Text style={s.scoreDenom}>/1</Text>
            </Text>

            <View style={[s.nivelBadge, { backgroundColor: nivelColor + '22' }]}>
              <Text style={[s.nivelBadgeText, { color: nivelColor }]}>{r.nivel}</Text>
            </View>

            <Text style={s.scoreDesc}>
              Realizas{' '}
              <Text style={{ fontFamily: 'Helvetica-Bold', color: C.navy }}>{r.score} de 9</Text>
              {' '}actividades digitales medidas por la ENAHO
            </Text>

            <BarraNiveles inad={r.inad} />
          </View>

          <View style={s.sep} />

          {/* ── BLOQUE 2: Comparativa con zoom geográfico (árbol) ── */}
          <View>
            <Text style={s.eyebrow}>Comparativa</Text>
            <Text style={s.secTitulo}>Tu posición relativa</Text>

            {comparativaItems.map((item, i) => (
              <ComparativaTreeItem
                key={item.name}
                name={item.name}
                place={item.place}
                promedio={item.promedio}
                diff={item.diff}
                color={item.color}
                depth={i}
              />
            ))}
          </View>
</View>
<View break>
          {/* ── BLOQUE 3: Temas a desarrollar ── */}
          {r.temas_desarrollar.length > 0 && (
            <View>
              <Text style={[s.eyebrow, s.eyebrowCoral]}>Áreas de mejora</Text>
              <Text style={s.secTitulo}>Temas que debes desarrollar</Text>
              {r.temas_desarrollar.map(tema => (
                <View key={tema.key} style={s.temaWrap} wrap={false}>
                  <Text style={s.temaTitulo}>{tema.tema}</Text>
                  <Text style={s.temaDesc}>{tema.descripcion}</Text>
                  <View style={s.cursosRow}>
                    
                    {tema.cursos.map(curso => (
                      <Link key={curso.nombre} src={curso.url} style={{ textDecoration: 'none' }}>
                      <View key={curso.nombre} style={s.cursoCard}>
                        <Text style={s.cursoNombre}>{curso.nombre}</Text>
                        <Text style={s.cursoPlat}>{curso.plataforma} · {curso.duracion}</Text>
                      </View>
                      </Link>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* ── BLOQUE 4: Lo que ya dominas ── */}
          {r.temas_dominados.length > 0 && (
            <View>
              <View style={s.sep} />
              <Text style={[s.eyebrow, s.eyebrowTeal]}>Fortalezas</Text>
              <Text style={s.secTitulo}>Lo que ya dominas</Text>
              {r.temas_dominados.map(tema => (
                <View key={tema.key} style={s.dominadoItem} wrap={false}>
                  <Text style={s.dominadoCheck}>✓</Text>
                  <Text style={s.dominadoLabel}>{tema.tema}</Text>
                </View>
              ))}
            </View>
          )}
</View>
        </View>

        <Footer fecha={fecha} email={email} />

      </Page>
    </Document>
  )
}