// src/hooks/useEmployee.test.tsx
import { renderHook } from '@testing-library/react';
import { useEmployee } from './useEmployee';
import { EmployeeContext, EmployeeContextType } from '../contexts/EmployeeContext';
import { ReactNode } from 'react';

describe('useEmployee hook', () => {
  const mockContext: EmployeeContextType = {
    employees: [
      {
        id: 1,
        name: 'João',
        cpf: '123',
        email: 'joao@test.com',
        position: 'Desenvolvedor',
        department: { id: 1, name: 'TI' },
        departmentId: 1,
        salary: 5000,
        admissionDate: '2023-01-01',
        isActive: true,
      },
    ],
    addEmployee: jest.fn(),
    updateEmployee: jest.fn(),
    deleteEmployee: jest.fn(),
    toggleActiveStatus: jest.fn(), // <- Adicionado
  };

  it('retorna o contexto corretamente dentro do provider', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <EmployeeContext.Provider value={mockContext}>{children}</EmployeeContext.Provider>
    );

    const { result } = renderHook(() => useEmployee(), { wrapper });
    expect(result.current).toEqual(mockContext);
  });

  it('lança erro se usado fora do provider', () => {
    let error: Error | null = null;

    try {
        renderHook(() => useEmployee());
    } catch (e) {
        error = e as Error;
    }

    expect(error).not.toBeNull();
    expect(error?.message).toBe('useEmployee deve ser usado dentro do EmployeeProvider');
  });
});
