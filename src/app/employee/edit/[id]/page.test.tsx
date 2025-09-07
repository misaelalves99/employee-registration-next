// app/employee/edit/[id]/page.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditEmployeePage from './page';
import { useRouter } from 'next/navigation';
import { useEmployee } from '../../../hooks/useEmployee';
import { getMockDepartments } from '../../../lib/mock/departments';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../../hooks/useEmployee', () => ({
  useEmployee: jest.fn(),
}));

jest.mock('../../../lib/mock/departments', () => ({
  getMockDepartments: jest.fn(),
}));

describe('EditEmployeePage', () => {
  const pushMock = jest.fn();

  const mockEmployee = {
    id: 1,
    name: 'João Silva',
    cpf: '123.456.789-00',
    email: 'joao@test.com',
    phone: '99999-9999',
    address: 'Rua A, 123',
    position: 'Desenvolvedor',
    department: { id: 1, name: 'TI' },
    departmentId: 1,
    salary: 5000,
    admissionDate: new Date().toISOString(),
    isActive: true,
  };

  const mockDepartments = [
    { id: 1, name: 'TI' },
    { id: 2, name: 'RH' },
  ];

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (getMockDepartments as jest.Mock).mockResolvedValue(mockDepartments);
    jest.clearAllMocks();
  });

  it('mostra loading inicialmente', () => {
    (useEmployee as jest.Mock).mockReturnValue({ employees: [mockEmployee], updateEmployee: jest.fn() });
    render(<EditEmployeePage params={{ id: '1' }} />);
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
  });

  it('renderiza formulário preenchido com dados do funcionário', async () => {
    (useEmployee as jest.Mock).mockReturnValue({ employees: [mockEmployee], updateEmployee: jest.fn() });

    render(<EditEmployeePage params={{ id: '1' }} />);
    await waitFor(() => {
      expect(screen.getByDisplayValue(mockEmployee.name)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockEmployee.cpf)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockEmployee.email)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockEmployee.phone)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockEmployee.address)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockEmployee.position)).toBeInTheDocument();
      expect(screen.getByDisplayValue(String(mockEmployee.departmentId))).toBeInTheDocument();
      expect(screen.getByDisplayValue(String(mockEmployee.salary))).toBeInTheDocument();
      expect(screen.getByLabelText(/Ativo/i)).toBeChecked();
    });
  });

  it('mostra erro quando funcionário não é encontrado', async () => {
    (useEmployee as jest.Mock).mockReturnValue({ employees: [], updateEmployee: jest.fn() });

    render(<EditEmployeePage params={{ id: '999' }} />);
    await waitFor(() => {
      expect(screen.getByText(/Funcionário não encontrado/i)).toBeInTheDocument();
    });
  });

  it('atualiza dados do funcionário e redireciona', async () => {
    const updateMock = jest.fn();
    (useEmployee as jest.Mock).mockReturnValue({ employees: [mockEmployee], updateEmployee: updateMock });

    render(<EditEmployeePage params={{ id: '1' }} />);
    await waitFor(() => screen.getByText(/Salvar/i));

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'João Atualizado' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'novo@email.com' } });
    fireEvent.change(screen.getByLabelText(/Cargo/i), { target: { value: 'Analista' } });
    fireEvent.change(screen.getByLabelText(/Departamento/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/Salário/i), { target: { value: '6000' } });
    fireEvent.click(screen.getByLabelText(/Ativo/i)); // alterna checkbox

    fireEvent.click(screen.getByText(/Salvar/i));

    await waitFor(() => {
      expect(updateMock).toHaveBeenCalledWith(
        mockEmployee.id,
        expect.objectContaining({
          name: 'João Atualizado',
          email: 'novo@email.com',
          position: 'Analista',
          departmentId: 2,
          salary: 6000,
          isActive: false,
        })
      );
      expect(pushMock).toHaveBeenCalledWith('/employee');
    });
  });
});
