// lib/mock/departments.test.ts

import { mockDepartments, getMockDepartments } from './departments'

describe('mockDepartments', () => {
  it('deve conter a lista de departamentos esperada', () => {
    expect(mockDepartments).toEqual([
      { id: 1, name: 'TI' },
      { id: 2, name: 'RH' },
      { id: 3, name: 'Marketing' },
    ])
  })
})

describe('getMockDepartments', () => {
  it('deve retornar a lista de departamentos', async () => {
    const departments = await getMockDepartments()
    expect(departments).toEqual(mockDepartments)
  })

  it('retorna uma Promise', () => {
    const result = getMockDepartments()
    expect(result).toBeInstanceOf(Promise)
  })
})
