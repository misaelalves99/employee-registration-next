// src/contexts/EmployeeProvider.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import React, { useContext } from 'react';
import { EmployeeProvider } from './EmployeeProvider';
import { EmployeeContext } from './EmployeeContext';
import { mockEmployees } from '../lib/mock/employees';

describe('EmployeeProvider', () => {
  const TestComponent = () => {
    const ctx = useContext(EmployeeContext)!;

    return (
      <div>
        <ul>
          {ctx.employees.map(emp => (
            <li key={emp.id}>{emp.name} - {emp.isActive ? 'Ativo' : 'Inativo'}</li>
          ))}
        </ul>

        <button
          onClick={() =>
            ctx.addEmployee({
              id: 999,
              name: 'Novo Funcionário',
              cpf: '000.000.000-00',
              email: 'novo@example.com',
              position: 'Outro', // ✅ tipo válido
              departmentId: 0,
              salary: 0,
              admissionDate: '2025-01-01',
              isActive: true
            })
          }
        >
          Adicionar
        </button>

        <button
          onClick={() => ctx.updateEmployee(mockEmployees[0].id, { name: 'Atualizado' })}
        >
          Atualizar
        </button>

        <button onClick={() => ctx.toggleActiveStatus(mockEmployees[0].id)}>
          Toggle Ativo
        </button>

        <button onClick={() => ctx.deleteEmployee(mockEmployees[0].id)}>
          Deletar
        </button>
      </div>
    );
  };

  beforeEach(() => {
    // Resetar mockEmployees
    mockEmployees.splice(0, mockEmployees.length);
    mockEmployees.push(
      {
        id: 1,
        name: 'João Silva',
        cpf: '123.456.789-00',
        email: 'joao@example.com',
        position: 'Desenvolvedor',
        departmentId: 1,
        salary: 5000,
        admissionDate: '2022-01-15',
        isActive: true
      },
      {
        id: 2,
        name: 'Maria Oliveira',
        cpf: '987.654.321-00',
        email: 'maria@example.com',
        position: 'Analista',
        departmentId: 2,
        salary: 4500,
        admissionDate: '2021-10-20',
        isActive: false
      }
    );
  });

  it('renderiza lista inicial de funcionários', () => {
    render(
      <EmployeeProvider>
        <TestComponent />
      </EmployeeProvider>
    );

    expect(screen.getByText('João Silva - Ativo')).toBeInTheDocument();
    expect(screen.getByText('Maria Oliveira - Inativo')).toBeInTheDocument();
  });

  it('adiciona funcionário', () => {
    render(
      <EmployeeProvider>
        <TestComponent />
      </EmployeeProvider>
    );

    fireEvent.click(screen.getByText('Adicionar'));
    expect(screen.getByText('Novo Funcionário - Ativo')).toBeInTheDocument();
  });

  it('atualiza funcionário', () => {
    render(
      <EmployeeProvider>
        <TestComponent />
      </EmployeeProvider>
    );

    fireEvent.click(screen.getByText('Atualizar'));
    expect(screen.getByText('Atualizado - Ativo')).toBeInTheDocument();
  });

  it('toggleActiveStatus altera status', () => {
    render(
      <EmployeeProvider>
        <TestComponent />
      </EmployeeProvider>
    );

    fireEvent.click(screen.getByText('Toggle Ativo'));
    expect(screen.getByText('João Silva - Inativo')).toBeInTheDocument();
  });

  it('deleta funcionário', () => {
    render(
      <EmployeeProvider>
        <TestComponent />
      </EmployeeProvider>
    );

    fireEvent.click(screen.getByText('Deletar'));
    expect(screen.queryByText('João Silva - Ativo')).not.toBeInTheDocument();
  });
});
