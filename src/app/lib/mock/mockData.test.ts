// lib/mock/mockData.test.ts

import { getMockEmployees, deleteMockEmployee } from './mockData';
import { Employee } from '../../types/employee';

describe('mockData', () => {
  const EMPLOYEE_KEY = 'mock_employees';

  const mockEmployee: Employee = {
    id: 1,
    name: 'Teste',
    cpf: '000.000.000-00',
    email: 'teste@example.com',
    phone: '123456789',
    address: 'Rua Teste',
    position: 'Desenvolvedor',
    department: { id: 1, name: 'TI' },
    departmentId: 1,
    salary: 1000,
    admissionDate: '2025-01-01',
    isActive: true,
  };

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(EMPLOYEE_KEY, JSON.stringify([mockEmployee]));
  });

  it('getMockEmployees deve retornar funcionários do localStorage', () => {
    const employees = getMockEmployees();
    expect(employees).toHaveLength(1);
    expect(employees[0].name).toBe('Teste');
  });

  it('getMockEmployees retorna array vazio se não houver dados', () => {
    localStorage.removeItem(EMPLOYEE_KEY);
    const employees = getMockEmployees();
    expect(employees).toEqual([]);
  });

  it('deleteMockEmployee remove corretamente o funcionário pelo id', () => {
    deleteMockEmployee(1);
    const employees = getMockEmployees();
    expect(employees).toHaveLength(0);
  });

  it('deleteMockEmployee não afeta outros funcionários', () => {
    const anotherEmployee: Employee = { ...mockEmployee, id: 2, name: 'Outro' };
    localStorage.setItem(EMPLOYEE_KEY, JSON.stringify([mockEmployee, anotherEmployee]));

    deleteMockEmployee(1);
    const employees = getMockEmployees();
    expect(employees).toHaveLength(1);
    expect(employees[0].id).toBe(2);
  });
});
