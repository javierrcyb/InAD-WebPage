import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { ReportePDF } from '@/pdf/ReportePDF'
import { ResultadoINAD } from '@/lib/calculations/InAdCalculation'
import React from 'react'
import type { DocumentProps } from '@react-pdf/renderer'

export async function POST(req: NextRequest) {
  try {
    const { resultado, email }: { resultado: ResultadoINAD; email: string } = await req.json()

    const element = React.createElement(ReportePDF, { resultado, email }) as React.ReactElement<DocumentProps>

    const buffer = await renderToBuffer(
      React.createElement(ReportePDF, { resultado, email }) as unknown as React.ReactElement<DocumentProps>
    )
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="INAD_${Date.now()}.pdf"`,
      },
    })
  } catch (err) {
    console.error('Error generando PDF:', err)
    return NextResponse.json({ error: 'Error generando PDF' }, { status: 500 })
  }
}