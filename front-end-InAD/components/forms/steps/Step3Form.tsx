'use client'
import { FormData } from '@/types'
import { UBIGEO_DEPARTMENTS, getDistrictsByProvince, getProvincesByDepartment } from '@/lib/constants/ubigeo'

interface Props { data: FormData; update: (f: Partial<FormData>) => void }

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '0.75rem 1rem',
  border: '1.5px solid rgba(0,0,0,0.12)', borderRadius: 8,
  fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem',
  color: '#1A1A2E', background: 'white', appearance: 'none',
}

export default function Step3Form({ data, update }: Props) {
  const provincias = getProvincesByDepartment(data.departamento)
  const distritos = getDistrictsByProvince(data.departamento, data.provincia)

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
            onChange={(e) => update({ departamento: e.target.value, provincia: '', distrito: '' })}
          >
            <option value="">— Selecciona tu departamento —</option>
            {UBIGEO_DEPARTMENTS.map((department) => (
              <option key={department.code} value={department.name}>
                {department.name}
              </option>
            ))}
          </select>
          <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999', pointerEvents: 'none' }}>▾</span>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1A1A2E', marginBottom: '0.5rem' }}>
          Provincia <span style={{ color: 'var(--coral)' }}>*</span>
        </label>
        <div style={{ position: 'relative' }}>
          <select
            style={selectStyle}
            value={data.provincia}
            disabled={!data.departamento}
            onChange={(e) => update({ provincia: e.target.value, distrito: '' })}
          >
            <option value="">— Selecciona tu provincia —</option>
            {provincias.map((province) => (
              <option key={province.code} value={province.name}>
                {province.name}
              </option>
            ))}
          </select>
          <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999', pointerEvents: 'none' }}>▾</span>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1A1A2E', marginBottom: '0.5rem' }}>
          Distrito <span style={{ color: 'var(--coral)' }}>*</span>
        </label>
        <div style={{ position: 'relative' }}>
          <select
            style={selectStyle}
            value={data.distrito}
            disabled={!data.provincia}
            onChange={(e) => update({ distrito: e.target.value })}
          >
            <option value="">— Selecciona tu distrito —</option>
            {distritos.map((district) => (
              <option key={district.code} value={district.name}>
                {district.name}
              </option>
            ))}
          </select>
          <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999', pointerEvents: 'none' }}>▾</span>
        </div>
      </div>
    </div>
  )
}