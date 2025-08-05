// lib/mock/employees.ts

import { Employee } from '../../types/employee';
import { mockDepartments } from './departments';

export const mockEmployees: Employee[] = [
  {
    id: 1,
    name: 'João Silva',
    cpf: '123.456.789-00',
    email: 'joao@example.com',
    phone: '(11) 99999-9999',
    address: 'Rua A, 123',
    position: 'Desenvolvedor',
    department: { id: 1, name: 'TI' },
    departmentId: 1,
    salary: 5500,
    admissionDate: '2022-01-15',
    isActive: false,
  },
  {
    id: 2,
    name: 'Maria Oliveira',
    cpf: '987.654.321-00',
    email: 'maria@example.com',
    phone: '(11) 98888-8888',
    address: 'Rua B, 456',
    position: 'Analista',
    department: { id: 2, name: 'RH' },
    departmentId: 2,
    salary: 4700,
    admissionDate: '2021-10-20',
    isActive: true,
  },
];

export function getEmployeeById(id: number): Employee | null {
  return mockEmployees.find(e => e.id === id) || null;
}

export function getAllMockEmployees(): Employee[] {
  return mockEmployees.map((emp) => ({
    ...emp,
    departmentName: emp.department?.name ?? '-',
    hiredDate: emp.admissionDate,
    active: emp.isActive,
  }));
}

export function updateMockEmployee(id: number, data: Partial<Employee>): boolean {
  const index = mockEmployees.findIndex(e => e.id === id);
  if (index !== -1) {
    mockEmployees[index] = {
      ...mockEmployees[index],
      ...data,
      department: data.departmentId
        ? {
            id: data.departmentId,
            name: getDepartmentNameById(data.departmentId),
          }
        : mockEmployees[index].department,
    };
    return true;
  }
  return false;
}

function getDepartmentNameById(id: number): string {
  const dep = mockDepartments.find(d => d.id === id);
  return dep ? dep.name : 'Desconhecido';
}

export function createMockEmployee(newEmployee: Employee): void {
  mockEmployees.push({
    ...newEmployee,
    department: newEmployee.departmentId
      ? {
          id: newEmployee.departmentId,
          name: getDepartmentNameById(newEmployee.departmentId),
        }
      : undefined,
  });
}
