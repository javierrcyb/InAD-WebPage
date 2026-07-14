// lib/auth/disposable-check.ts
const DOMAINS_URL = 'https://raw.githubusercontent.com/doodad-labs/disposable-email-domains/main/data/domains.txt'

let disposableSet: Set<string> | null = null
let lastFetch = 0
const CACHE_TTL = 1000 * 60 * 60 * 24 // 24 horas

async function loadDisposableDomains(): Promise<Set<string>> {
  const now = Date.now()
  if (disposableSet && now - lastFetch < CACHE_TTL) {
    return disposableSet
  }

  const res = await fetch(DOMAINS_URL)
  if (!res.ok) {
    // si falla el fetch, usa el set anterior si existe, o uno vacío
    return disposableSet ?? new Set()
  }

  const text = await res.text()
  disposableSet = new Set(
    text.split('\n').map(d => d.trim().toLowerCase()).filter(Boolean)
  )
  lastFetch = now

  return disposableSet
}

export async function isDisposableEmail(email: string): Promise<boolean> {
  const domain = email.split('@')[1]?.toLowerCase().trim()
  if (!domain) return true

  const domains = await loadDisposableDomains()
  return domains.has(domain)
}