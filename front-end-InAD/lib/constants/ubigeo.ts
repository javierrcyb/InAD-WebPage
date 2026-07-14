import ubigeoData from '@/lib/data/jerarquia_inad.json'

export interface UbigeoDistrict {
  codigo: string
  nombre: string
  inad: number
  incidencia_H: number
  intensidad_A: number
}

export interface UbigeoProvince {
  codigo: string
  nombre: string
  inad: number
  incidencia_H: number
  intensidad_A: number
  distritos: UbigeoDistrict[]
}

export interface UbigeoDepartment {
  codigo: string
  nombre: string
  inad: number
  incidencia_H: number
  intensidad_A: number
  provincias: UbigeoProvince[]
}

export interface UbigeoMacroregion {
  codigo: string
  nombre: string
  inad: number
  incidencia_H: number
  intensidad_A: number
  departamentos: UbigeoDepartment[]
}

type UbigeoData = {
  año: number
  macroregiones: UbigeoMacroregion[]
}

const { macroregiones } = ubigeoData as UbigeoData

export const UBIGEO_MACROREGIONES = macroregiones

export const UBIGEO_DEPARTMENTS = macroregiones.flatMap((macroregion) => macroregion.departamentos)

export const getProvincesByDepartment = (departmentName: string) =>
  UBIGEO_DEPARTMENTS.find((department) => department.nombre === departmentName)?.provincias ?? []

export const getDistrictsByProvince = (departmentName: string, provinceName: string) =>
  getProvincesByDepartment(departmentName).find((province) => province.nombre === provinceName)?.distritos ?? []