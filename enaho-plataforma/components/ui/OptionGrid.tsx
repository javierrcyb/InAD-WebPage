'use client'

interface GridProps {
  label: string
  cols?: 2 | 3
  children: React.ReactNode
}

interface ItemProps {
  label: string
  selected: boolean
  onClick: () => void
}

export function OptionGrid({ label, cols = 2, children }: GridProps) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1A1A2E', marginBottom: '0.5rem' }}>
        {label} <span style={{ color: 'var(--coral)' }}>*</span>
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '0.6rem' }}>
        {children}
      </div>
    </div>
  )
}

export function OptionItem({ label, selected, onClick }: ItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        padding: '0.65rem 0.9rem', borderRadius: 8, textAlign: 'left',
        border: `1.5px solid ${selected ? 'var(--teal)' : 'rgba(0,0,0,0.1)'}`,
        background: selected ? 'rgba(74,151,154,0.1)' : 'white',
        color: selected ? 'var(--navy)' : '#1A1A2E',
        fontWeight: selected ? 600 : 400,
        fontSize: '0.88rem', cursor: 'pointer', transition: 'all .2s',
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      <span style={{
        width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
        border: `2px solid ${selected ? 'var(--teal)' : 'rgba(0,0,0,0.2)'}`,
        background: selected ? 'var(--teal)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {selected && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', display: 'block' }} />}
      </span>
      {label}
    </button>
  )
}