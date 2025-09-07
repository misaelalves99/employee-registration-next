// app/employee/create/page.test.tsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import CreateEmployeePage from './page';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { getMockDepartments } from '../../lib/mock/departments';
import { getMockPositions } from '../../lib/mock/positions';
import { createMockEmployee } from '../../lib/mock/employees';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../lib/mock/departments', () => ({
  getMockDepartments: jest.fn(),
}));

jest.mock('../../lib/mock/positions', () => ({
  getMockPositions: jest.fn(),
}));

jest.mock('../../lib/mock/employees', () => ({
  createMockEmployee: jest.fn(),
}));

describe('CreateEmployeePage', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (getMockDepartments as jest.Mock).mockResolvedValue([{ id: 1, name: 'TI' }]);
    (getMockPositions as jest.Mock).mockResolvedValue(['Desenvolvedor']);
    (createMockEmployee as jest.Mock).mockResolvedValue(null);
    jest.clearAllMocks();
  });

  it('exibe loading inicialmente', () => {
    render(<CreateEmployeePage />);
    expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
  });

  it('renderiza formulário após carregar departamentos e posições', async () => {
    render(<CreateEmployeePage />);
    await waitFor(() => {
      expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/CPF/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Telefone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Endereço/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Salário/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Data de Admissão/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Departamento/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Cargo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Ativo/i)).toBeInTheDocument();
    });
  });

  it('permite preencher o formulário e criar funcionário', async () => {
    render(<CreateEmployeePage />);
    await waitFor(() => screen.getByLabelText(/Nome/i));

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: '123.456.789-00' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'joao@example.com' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '11999999999' } });
    fireEvent.change(screen.getByLabelText(/Endereço/i), { target: { value: 'Rua A, 123' } });
    fireEvent.change(screen.getByLabelText(/Salário/i), { target: { value: '5000' } });
    fireEvent.change(screen.getByLabelText(/Data de Admissão/i), { target: { value: '2023-01-01' } });
    fireEvent.change(screen.getByLabelText(/Departamento/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Cargo/i), { target: { value: 'Desenvolvedor' } });
    fireEvent.click(screen.getByLabelText(/Ativo/i));

    fireEvent.click(screen.getByRole('button', { name: /Criar Funcionário/i }));

    await waitFor(() => {
      expect(createMockEmployee).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'João Silva',
          cpf: '123.456.789-00',
          email: 'joao@example.com',
          phone: '11999999999',
          address: 'Rua A, 123',
          salary: 5000,
          admissionDate: '2023-01-01',
          departmentId: 1,
          position: 'Desenvolvedor',
          isActive: true,
        })
      );
      expect(pushMock).toHaveBeenCalledWith('/employee');
    });
  });

  it('botão de voltar redireciona para /employee', async () => {
    render(<CreateEmployeePage />);
    await waitFor(() => screen.getByRole('button', { name: /Voltar/i }));

    fireEvent.click(screen.getByRole('button', { name: /Voltar/i }));
    expect(pushMock).toHaveBeenCalledWith('/employee');
  });

  it('valida required para campos obrigatórios', async () => {
    render(<CreateEmployeePage />);
    await waitFor(() => screen.getByRole('button', { name: /Criar Funcionário/i }));

    const submitButton = screen.getByRole('button', { name: /Criar Funcionário/i });
    fireEvent.click(submitButton);

    // O createMockEmployee não deve ser chamado se campos obrigatórios estiverem vazios
    expect(createMockEmployee).not.toHaveBeenCalled();
  });
});
