// lib/api/responses.ts
import type { FormData } from '@/types'

export async function getFormResponse() {
  const res = await fetch('/api/responses')
  if (!res.ok) return { success: false, error: 'Error al cargar la respuesta' }
  const data = await res.json()
  return { success: true, ...data }
}

export async function saveFormDraft(formData: FormData) {
  const res = await fetch('/api/responses/draft', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
  const data = await res.json()
  if (!res.ok) return { success: false, error: data.error }
  return { success: true, data: data.data }
}

export async function completeFormResponse(formData: FormData) {
  const res = await fetch('/api/responses/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
  const data = await res.json()
  if (!res.ok) return { success: false, error: data.error }
  return { success: true, data: data.data }
}