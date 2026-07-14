// app/api/responses/draft/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { FormData } from '@/types'
import { checkOrigin } from '@/lib/security/originCheck'

function extractPersonalFields(formData: FormData) {
    return {
        nombre: formData.nombre || null,
        apellido: formData.apellido || null,
        ocupacion: formData.ocupacion || null,
        institucion: formData.institucion || null,
        telefono: formData.telefono || null,
    }
}

export async function POST(req: NextRequest) {
    const originError = checkOrigin(req)
    if (originError) return originError

    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const formData: FormData = await req.json()

    const { data, error } = await supabase
        .from('responses')
        .upsert(
            {
                user_id: user.id,
                user_email: user.email ?? null,
                auth_provider: user.app_metadata?.provider ?? null,
                completed: true,
                completed_at: new Date().toISOString(),
                form_data: formData,
                ...extractPersonalFields(formData),
            },
            { onConflict: 'user_id' }
        )
        .select()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
}