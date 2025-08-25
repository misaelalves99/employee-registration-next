// lib/mock/employees.test.ts

import {
  mockEmployees,
  getEmployeeById,
  getAllMockEmployees,
  updateMockEmployee,
  createMockEmployee,
} from './employees';
import { mockDepartments } from './departments';

// ✅ Import dos tipos
import type { Employee } from '../../types/employee';
import type { Position } from '../../types/position';

describe('mockEmployees', () => {
  it('deve conter funcionários iniciais', () => {
    expect(mockEmployees.length).toBeGreaterThan(0);
    expect(mockEmployees[0]).toHaveProperty('id');
    expect(mockEmployees[0]).toHaveProperty('name');
  });
});

describe('getEmployeeById', () => {
  it('retorna o funcionário correto pelo ID', () => {
    const emp = getEmployeeById(1);
    expect(emp).not.toBeNull();
    expect(emp?.name).toBe('João Silva');
  });

  it('retorna null se o funcionário não existir', () => {
    const emp = getEmployeeById(999);
    expect(emp).toBeNull();
  });
});

describe('getAllMockEmployees', () => {
  it('retorna todos os funcionários com campos derivados', () => {
    const all = getAllMockEmployees();
    expect(all[0]).toHaveProperty('departmentName');
    expect(all[0]).toHaveProperty('hiredDate');
    expect(all[0]).toHaveProperty('active');
  });
});

describe('updateMockEmployee', () => {
  it('atualiza corretamente um funcionário existente', () => {
    const result = updateMockEmployee(1, { name: 'João Atualizado', departmentId: 2 });
    expect(result).toBe(true);

    const updated = getEmployeeById(1);
    expect(updated?.name).toBe('João Atualizado');
    expect(updated?.department?.id).toBe(2);
    expect(updated?.department?.name).toBe(mockDepartments.find(d => d.id === 2)?.name);
  });

  it('retorna false se o funcionário não existir', () => {
    const result = updateMockEmployee(999, { name: 'Teste' });
    expect(result).toBe(false);
  });
});

describe('createMockEmployee', () => {
  it('adiciona um novo funcionário corretamente', () => {
    const newEmp: Employee = {
      id: 999,
      name: 'Novo Funcionário',
      cpf: '000.000.000-00',
      email: 'novo@example.com',
      phone: '123456789',
      address: 'Rua Teste',
      position: 'Outro' as Position, // ✅ cast para Position
      departmentId: 1,
      salary: 3000,
      admissionDate: '2025-01-01',
      isActive: true,
    };
    createMockEmployee(newEmp);

    const emp = getEmployeeById(999);
    expect(emp).not.toBeNull();
    expect(emp?.name).toBe('Novo Funcionário');
    expect(emp?.department?.name).toBe(mockDepartments.find(d => d.id === 1)?.name);
  });
});
