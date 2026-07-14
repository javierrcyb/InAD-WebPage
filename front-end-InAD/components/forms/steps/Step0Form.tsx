'use client'

import { useState } from 'react'
import ocupacionesData from '@/lib/data/ocupaciones.json'
import { FormData } from '@/types'

const inputStyle = (disabled = false, error = false): React.CSSProperties => ({
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: 8,
  border: `1.5px solid ${error ? 'var(--coral)' : 'rgba(0,0,0,0.12)'}`,
  fontFamily: 'DM Sans, sans-serif',
  fontSize: '0.95rem',
  color: disabled ? '#9CA3AF' : 'var(--navy)',
  background: disabled ? '#F9F9F9' : 'white',
  outline: 'none',
  cursor: disabled ? 'not-allowed' : 'text',
})

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.78rem',
  fontWeight: 700,
  color: 'var(--teal)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: '0.4rem',
}

function Field({ label, value, onChange, placeholder, required = false, optional = false, disabled = false, type = 'text', error }: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  required?: boolean
  optional?: boolean
  disabled?: boolean
  type?: string
  error?: string
}) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: 'var(--coral)' }}> *</span>}
        {optional && <span style={{ color: '#9CA3AF', fontWeight: 400, marginLeft: '0.4rem', textTransform: 'none', letterSpacing: 0 }}>(opcional)</span>}
        {disabled && <span style={{ color: '#4A979A', fontWeight: 400, marginLeft: '0.4rem', textTransform: 'none', letterSpacing: 0 }}>· completado con tu cuenta Google</span>}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        style={inputStyle(disabled, !!error)}
        onFocus={e => { if (!disabled) e.currentTarget.style.borderColor = error ? 'var(--coral)' : 'var(--teal)' }}
        onBlur={e => { if (!disabled) e.currentTarget.style.borderColor = error ? 'var(--coral)' : 'rgba(0,0,0,0.12)' }}
      />
      {error && (
        <span style={{ fontSize: '0.78rem', color: 'var(--coral)', marginTop: '0.3rem', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  )
}

function OcupacionCombobox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const filtradas = query.length === 0
    ? ocupacionesData
    : ocupacionesData.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))

  const selected = ocupacionesData.find(o => o.code === value)

  return (
    <div style={{ marginBottom: '1.25rem', position: 'relative' }}>
      <label style={labelStyle}>
        Ocupación <span style={{ color: 'var(--coral)' }}>*</span>
      </label>
      <input
        type="text"
        placeholder="Busca o selecciona tu ocupación..."
        value={open ? query : (selected?.label ?? '')}
        onChange={e => {
          setQuery(e.target.value)
          setOpen(true)
          if (!e.target.value) onChange('')
        }}
        onFocus={() => { setQuery(''); setOpen(true) }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        style={{ ...inputStyle(), borderColor: open ? 'var(--teal)' : 'rgba(0,0,0,0.12)' }}
      />
      <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(4px)', color: '#9CA3AF', pointerEvents: 'none', fontSize: '0.75rem' }}>
        {open ? '▲' : '▼'}
      </span>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: 'white', border: '1.5px solid rgba(0,0,0,0.12)', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 50, maxHeight: 220, overflowY: 'auto' }}>
          {filtradas.length > 0 ? (
            filtradas.map(o => (
              <div
                key={o.code}
                onMouseDown={() => { onChange(o.code); setQuery(o.label); setOpen(false) }}
                style={{ padding: '0.65rem 1rem', fontSize: '0.9rem', color: o.code === value ? 'var(--teal)' : 'var(--navy)', background: o.code === value ? 'rgba(74,151,154,0.07)' : 'white', fontWeight: o.code === value ? 600 : 400, cursor: 'pointer' }}
                onMouseEnter={e => { if (o.code !== value) (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.03)' }}
                onMouseLeave={e => { if (o.code !== value) (e.currentTarget as HTMLDivElement).style.background = 'white' }}
              >
                {o.label}
              </div>
            ))
          ) : (
            <div style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#9CA3AF' }}>
              Sin resultados para &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface Props {
  data: FormData
  update: (f: Partial<FormData>) => void
  errors?: Partial<Record<keyof FormData, string>>
  fromGoogle: boolean
}

function PhoneField({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={labelStyle}>
        Número de teléfono
        <span style={{ color: '#9CA3AF', fontWeight: 400, marginLeft: '0.4rem', textTransform: 'none', letterSpacing: 0 }}>(opcional)</span>
      </label>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: 8,
        border: `1.5px solid ${error ? 'var(--coral)' : focused ? 'var(--teal)' : 'rgba(0,0,0,0.12)'}`,
        background: 'white',
        overflow: 'hidden',
        transition: 'border-color 0.15s',
      }}>
        <span style={{
          padding: '0.75rem 0.75rem 0.75rem 1rem',
          fontSize: '0.95rem',
          color: 'var(--navy)',
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 500,
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}>
          +51
        </span>
        <span style={{ width: 1, height: '1.25rem', background: 'rgba(0,0,0,0.15)', flexShrink: 0 }} />
        <input
          type="tel"
          value={value}
          placeholder="999 888 777"
          onChange={e => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 9)
            if (val.length > 0 && val[0] !== '9') return
            onChange(val)
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            border: 'none',
            outline: 'none',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.95rem',
            color: 'var(--navy)',
            background: 'transparent',
          }}
        />
      </div>
      {error && (
        <span style={{ fontSize: '0.78rem', color: 'var(--coral)', marginTop: '0.3rem', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  )
}

export default function Step0Form({ data, update, errors = {}, fromGoogle }: Props) {
  return (
    <div>
      {/* ✅ fromGoogle era un booleano suelto en el JSX — eso causaba el crash */}
      {fromGoogle && (
        <p style={{ fontSize: '0.82rem', color: '#4A979A', marginBottom: '1.25rem' }}>
          Algunos datos fueron completados con tu cuenta Google.
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Nombre" value={data.nombre} onChange={v => update({ nombre: v })} required placeholder="Ej: María" error={errors.nombre} />
        <Field label="Apellido" value={data.apellido} onChange={v => update({ apellido: v })} required placeholder="Ej: García" error={errors.apellido} />
      </div>

      <OcupacionCombobox value={data.ocupacion} onChange={v => update({ ocupacion: v })} />

      <Field label="Institución" value={data.institucion} onChange={v => update({ institucion: v })} required placeholder="Ej: UGEL Lima, Universidad Nacional..." error={errors.institucion} />
      <PhoneField value={data.telefono} onChange={v => update({ telefono: v })} error={errors.telefono} />
    </div>
  )
}