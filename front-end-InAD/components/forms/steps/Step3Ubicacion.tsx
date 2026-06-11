// VER QUE HACER CON ESTO


'use client'
import { FormData, Region } from '@/types'
import { OptionGrid, OptionItem } from '@/components/ui/OptionGrid'

interface Props { data: FormData; update: (f: Partial<FormData>) => void }

const DEPARTAMENTOS = [
  'Amazonas','Áncash','Apurímac','Arequipa','Ayacucho','Cajamarca','Callao','Cusco',
  'Huancavelica','Huánuco','Ica','Junín','La Libertad','Lambayeque','Lima','Loreto',
  'Madre de Dios','Moquegua','Pasco','Piura','Puno','San Martín','Tacna','Tumbes','Ucayali',
]

const DISTRITOS_LIMA = [
  'Ate','Barranco','Breña','Carabayllo','Chorrillos','Comas','El Agustino',
  'Independencia','Jesús María','La Molina','La Victoria','Lince','Los Olivos',
  'Lurigancho','Lurín','Magdalena del Mar','Miraflores','Pueblo Libre','Puente Piedra',
  'Rímac','San Borja','San Isidro','San Juan de Lurigancho','San Juan de Miraflores',
  'San Luis','San Martín de Porres','San Miguel','Santa Anita','Santiago de Surco',
  'Surquillo','Villa El Salvador','Villa María del Triunfo','Lima (Centro)',
]

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '0.75rem 1rem',
  border: '1.5px solid rgba(0,0,0,0.12)', borderRadius: 8,
  fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem',
  color: '#1A1A2E', background: 'white', appearance: 'none',
}

export default function Step3Ubicacion({ data, update }: Props) {
  const needsDistrito = data.departamento === 'Lima' || data.departamento === 'Callao'

  return (
    <div>


      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1A1A2E', marginBottom: '0.5rem' }}>
          Departamento <span style={{ color: 'var(--coral)' }}>*</span>
        </label>
        <div style={{ position: 'relative' }}>
          <select
            style={selectStyle}
            value={data.departamento}
            onChange={e => update({ departamento: e.target.value, distrito: '' })}
          >
            <option value="">— Selecciona tu departamento —</option>
            {DEPARTAMENTOS.map(d => <option key={d}>{d}</option>)}
          </select>
          <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999', pointerEvents: 'none' }}>▾</span>
        </div>
      </div>

      {needsDistrito && (
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1A1A2E', marginBottom: '0.5rem' }}>
            Distrito <span style={{ color: 'var(--coral)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <select
              style={selectStyle}
              value={data.distrito}
              onChange={e => update({ distrito: e.target.value })}
            >
              <option value="">— Selecciona tu distrito —</option>
              {DISTRITOS_LIMA.map(d => <option key={d}>{d}</option>)}
            </select>
            <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999', pointerEvents: 'none' }}>▾</span>
          </div>
        </div>
      )}
    </div>
  )
}