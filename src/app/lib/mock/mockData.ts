// lib/mock/mockData.ts

'use client'

import { Employee } from '../../types/employee'

const EMPLOYEE_KEY = 'mock_employees'

export function getMockEmployees(): Employee[] {
  const json = localStorage.getItem(EMPLOYEE_KEY)
  return json ? JSON.parse(json) : []
}

export function deleteMockEmployee(id: number): void {
  const employees = getMockEmployees()
  const updated = employees.filter(emp => emp.id !== id)
  localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(updated))
}
