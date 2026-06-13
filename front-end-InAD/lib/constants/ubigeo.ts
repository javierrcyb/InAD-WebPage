import ubigeoData from '@/data/ubigeo.json'

export interface UbigeoDistrict {
  code: string
  name: string
}

export interface UbigeoProvince {
  code: string
  name: string
  districts: UbigeoDistrict[]
}

export interface UbigeoDepartment {
  code: string
  name: string
  provinces: UbigeoProvince[]
}

type UbigeoData = {
  departments: UbigeoDepartment[]
}

const { departments } = ubigeoData as UbigeoData

export const UBIGEO_DEPARTMENTS = departments

export const getProvincesByDepartment = (departmentName: string) =>
  UBIGEO_DEPARTMENTS.find((department) => department.name === departmentName)?.provinces ?? []

export const getDistrictsByProvince = (departmentName: string, provinceName: string) =>
  getProvincesByDepartment(departmentName).find((province) => province.name === provinceName)?.districts ?? []