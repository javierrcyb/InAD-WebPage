'use client'
import { useState } from 'react'
import { FORM_DICTIONARIES } from '@/lib/constants/dictionaries'
import { FormData, LenguaMaterna } from '@/types'
import { OptionGrid, OptionItem } from '@/components/ui/OptionGrid'

interface Props {
  data: FormData
  update: (f: Partial<FormData>) => void
}

const LENGUAS = FORM_DICTIONARIES.lenguaMaterna

function LanguageDropdown({
  label,
  value,
  onChange,
  exclude = [],
  placeholder = 'Selecciona una lengua',
}: {
  label: string
  value: LenguaMaterna | null
  onChange: (v: LenguaMaterna) => void
  exclude?: LenguaMaterna[]
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const options = LENGUAS.filter(l => !exclude.includes(l.value as LenguaMaterna))
  const selected = LENGUAS.find(l => l.value === value)

  return (
    <div style={{ marginBottom: '0.5rem', position: 'relative' }}>
      <label style={{
        display: 'block',
        fontSize: '0.78rem',
        fontWeight: 700,
        color: 'var(--teal)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: '0.4rem',
      }}>
        {label}
      </label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          padding: '0.7rem 2.2rem 0.7rem 1rem',
          borderRadius: 8,
          border: `1.5px solid ${open ? 'var(--teal)' : 'rgba(0,0,0,0.12)'}`,
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.95rem',
          color: selected ? 'var(--navy)' : '#9CA3AF',
          background: 'white',
          cursor: 'pointer',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12" height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6B7280"
          strokeWidth="2"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown list */}
      {open && (
        <>
          {/* Overlay para cerrar al clickar fuera */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 10 }}
          />
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: 'white',
            border: '1.5px solid rgba(0,0,0,0.12)',
            borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            zIndex: 20,
            maxHeight: 220,
            overflowY: 'auto',
          }}>
            {options.map(l => (
              <div
                key={l.value}
                onClick={() => {
                  onChange(l.value as LenguaMaterna)
                  setOpen(false)
                }}
                style={{
                  padding: '0.65rem 1rem',
                  fontSize: '0.95rem',
                  fontFamily: 'DM Sans, sans-serif',
                  color: l.value === value ? 'var(--teal)' : 'var(--navy)',
                  background: l.value === value ? 'rgba(0,128,128,0.06)' : 'white',
                  cursor: 'pointer',
                  fontWeight: l.value === value ? 600 : 400,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => {
                  if (l.value !== value) (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.04)'
                }}
                onMouseLeave={e => {
                  if (l.value !== value) (e.currentTarget as HTMLDivElement).style.background = 'white'
                }}
              >
                {l.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function Step1Form({ data, update }: Props) {
  const otrasLenguas = data.otrasLenguas ?? []

  const handleChangeOtra = (index: number, value: LenguaMaterna) => {
    const updated = [...otrasLenguas]
    updated[index] = value
    update({ otrasLenguas: updated })
  }

  const handleRemoveOtra = (index: number) => {
    update({ otrasLenguas: otrasLenguas.filter((_, i) => i !== index) })
  }

  const handleAddLengua = () => {
    update({ otrasLenguas: [...otrasLenguas, null as unknown as LenguaMaterna] })
  }

  const usados: LenguaMaterna[] = [
    ...(data.lengua ? [data.lengua] : []),
    ...otrasLenguas.filter(Boolean),
  ]

  return (
    <div>
      <OptionGrid label="¿Para quién estás llenando este formulario?" cols={2}>
        <OptionItem
          label="Para mí mismo"
          selected={data.respondentType === 'self'}
          onClick={() => update({ respondentType: 'self' })}
        />
        <OptionItem
          label="Para otra persona"
          selected={data.respondentType === 'third_party'}
          onClick={() => update({ respondentType: 'third_party' })}
        />
      </OptionGrid>

      <OptionGrid label="Sexo" cols={2}>
        {FORM_DICTIONARIES.sexo.map(option => (
          <OptionItem
            key={option.value}
            label={option.label}
            selected={data.sexo === option.value}
            onClick={() => update({ sexo: option.value })}
          />
        ))}
      </OptionGrid>

      <OptionGrid label="Edad" cols={3}>
        {FORM_DICTIONARIES.edadGrupo.map(group => (
          <OptionItem
            key={group.value}
            label={group.label}
            selected={data.edad === group.value}
            onClick={() => update({ edad: group.value })}
          />
        ))}
      </OptionGrid>

      {/* Lengua materna + otras lenguas */}
      <div style={{ marginBottom: '1.75rem' }}>
        <LanguageDropdown
          label="Lengua materna"
          value={data.lengua}
          onChange={v => update({ lengua: v })}
          exclude={otrasLenguas.filter(Boolean)}
        />

        {otrasLenguas.map((lengua, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', marginTop: '0.75rem' }}>
            <div style={{ flex: 1 }}>
              <LanguageDropdown
                label={`Otra lengua ${i + 1}`}
                value={lengua ?? null}
                onChange={v => handleChangeOtra(i, v)}
                exclude={usados.filter(u => u !== lengua)}
                placeholder="Selecciona otra lengua"
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemoveOtra(i)}
              style={{
                marginBottom: '0.5rem',
                padding: '0.6rem 0.8rem',
                borderRadius: 8,
                border: '1.5px solid rgba(0,0,0,0.12)',
                background: 'none',
                cursor: 'pointer',
                color: '#9CA3AF',
                fontSize: '1rem',
                lineHeight: 1,
              }}
              title="Eliminar"
            >
              ✕
            </button>
          </div>
        ))}

        {data.lengua && usados.length < LENGUAS.length && (
          <button
            type="button"
            onClick={handleAddLengua}
            style={{
              marginTop: '0.75rem',
              padding: '0.55rem 1rem',
              borderRadius: 8,
              border: '1.5px dashed rgba(0,0,0,0.2)',
              background: 'none',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--teal)',
              cursor: 'pointer',
            }}
          >
            + Agregar otra lengua
          </button>
        )}
      </div>
    </div>
  )
}