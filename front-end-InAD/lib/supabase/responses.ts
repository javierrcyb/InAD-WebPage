import { FormData } from '@/types'
import { createBrowserSupabaseClient } from './client'

type ResponseRow = {
	form_data: FormData
	completed: boolean | null
	completed_at: string | null
}

async function getAuthenticatedUser() {
	const supabase = createBrowserSupabaseClient()
	const { data: { user }, error } = await supabase.auth.getUser()

	if (error || !user) {
		throw new Error('Usuario no autenticado')
	}

	return { supabase, user }
}

/**
 * Obtiene la respuesta guardada del usuario autenticado.
 */
export async function getFormResponse() {
	try {
		const { supabase, user } = await getAuthenticatedUser()

		const { data, error } = await supabase
			.from('responses')
			.select('form_data, completed, completed_at')
			.eq('user_id', user.id)
			.maybeSingle()

		if (error) {
			throw error
		}

		return {
			success: true,
			data: (data as ResponseRow | null)?.form_data ?? null,
			completed: Boolean((data as ResponseRow | null)?.completed),
			completedAt: (data as ResponseRow | null)?.completed_at ?? null,
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Error al cargar la respuesta'
		return { success: false, error: message }
	}
}

/**
 * Guarda el progreso parcial del formulario para el usuario autenticado.
 */
export async function saveFormDraft(formData: FormData) {
	try {
		const { supabase, user } = await getAuthenticatedUser()
		console.log('💾 Guardando draft para:', user.id)

		const { data, error } = await supabase
			.from('responses')
			.upsert(
				{
					user_id: user.id,
					user_email: user.email ?? null,
					auth_provider: user.app_metadata?.provider ?? null,
					completed: false,
					completed_at: null,
					form_data: formData,
				},
				{ onConflict: 'user_id' },
			)
			.select()

		if (error) {
			console.error('Error al guardar:', error)
			throw error
		}
		console.log('Draft guardado:', data)
		return { success: true, data }
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Error al guardar la respuesta'
		return { success: false, error: message }
	}
}

/**
 * Marca la evaluación como terminada para el usuario autenticado.
 */
export async function completeFormResponse(formData: FormData) {
	try {
		const { supabase, user } = await getAuthenticatedUser()

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
				},
				{ onConflict: 'user_id' },
			)
			.select()

		if (error) {
			throw error
		}

		return { success: true, data }
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Error al finalizar la evaluación'
		return { success: false, error: message }
	}
}
