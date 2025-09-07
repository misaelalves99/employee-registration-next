// app/employee/delete/[id]/page.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmployeeDeletePage from './page';
import { useRouter } from 'next/navigation';
import { useEmployee } from '../../../hooks/useEmployee';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../../hooks/useEmployee', () => ({
  useEmployee: jest.fn(),
}));

describe('EmployeeDeletePage', () => {
  const pushMock = jest.fn();

  const mockEmployee = {
    id: 1,
    name: 'João Silva',
    cpf: '123.456.789-00',
    email: 'joao@test.com',
    position: 'Desenvolvedor',
    department: { id: 1, name: 'TI' },
    salary: 5000,
    admissionDate: new Date().toISOString(),
    isActive: true,
    phone: '11999999999',
    address: 'Rua A, 123',
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();
  });

  it('mostra loading inicialmente', () => {
    (useEmployee as jest.Mock).mockReturnValue({ employees: [mockEmployee], deleteEmployee: jest.fn() });
    render(<EmployeeDeletePage params={{ id: '1' }} />);
    expect(screen.getByText(/Carregando funcionário/i)).toBeInTheDocument();
  });

  it('renderiza detalhes do funcionário quando encontrado', async () => {
    (useEmployee as jest.Mock).mockReturnValue({ employees: [mockEmployee], deleteEmployee: jest.fn() });

    render(<EmployeeDeletePage params={{ id: '1' }} />);

    await waitFor(() => {
      expect(screen.getByText(/Deletar Funcionário/i)).toBeInTheDocument();
      expect(screen.getByText(mockEmployee.name)).toBeInTheDocument();
      expect(screen.getByText(mockEmployee.cpf)).toBeInTheDocument();
      expect(screen.getByText(mockEmployee.email)).toBeInTheDocument();
      expect(screen.getByText(mockEmployee.position)).toBeInTheDocument();
      expect(screen.getByText(mockEmployee.department.name)).toBeInTheDocument();
      expect(screen.getByText(mockEmployee.phone)).toBeInTheDocument();
      expect(screen.getByText(mockEmployee.address)).toBeInTheDocument();
      expect(screen.getByText(`R$ ${mockEmployee.salary.toLocaleString('pt-BR')}`)).toBeInTheDocument();
    });
  });

  it('mostra erro quando funcionário não é encontrado', async () => {
    (useEmployee as jest.Mock).mockReturnValue({ employees: [], deleteEmployee: jest.fn() });
    render(<EmployeeDeletePage params={{ id: '999' }} />);

    await waitFor(() => {
      expect(screen.getByText(/Funcionário não encontrado/i)).toBeInTheDocument();
    });
  });

  it('deleta funcionário após confirmação e redireciona', async () => {
    const deleteMock = jest.fn();
    (useEmployee as jest.Mock).mockReturnValue({ employees: [mockEmployee], deleteEmployee: deleteMock });
    window.confirm = jest.fn(() => true);

    render(<EmployeeDeletePage params={{ id: '1' }} />);
    await waitFor(() => screen.getByText(/Deletar/i));

    fireEvent.click(screen.getByText(/Deletar/i));

    await waitFor(() => {
      expect(deleteMock).toHaveBeenCalledWith(1);
      expect(pushMock).toHaveBeenCalledWith('/employee');
    });
  });

  it('não deleta funcionário se confirmação for cancelada', async () => {
    const deleteMock = jest.fn();
    (useEmployee as jest.Mock).mockReturnValue({ employees: [mockEmployee], deleteEmployee: deleteMock });
    window.confirm = jest.fn(() => false);

    render(<EmployeeDeletePage params={{ id: '1' }} />);
    await waitFor(() => screen.getByText(/Deletar/i));

    fireEvent.click(screen.getByText(/Deletar/i));

    await waitFor(() => {
      expect(deleteMock).not.toHaveBeenCalled();
      expect(pushMock).not.toHaveBeenCalled();
    });
  });

  it('mostra erro caso deleteEmployee lance exceção', async () => {
    const deleteMock = jest.fn(() => { throw new Error('Falha') });
    (useEmployee as jest.Mock).mockReturnValue({ employees: [mockEmployee], deleteEmployee: deleteMock });
    window.confirm = jest.fn(() => true);

    render(<EmployeeDeletePage params={{ id: '1' }} />);
    await waitFor(() => screen.getByText(/Deletar/i));

    fireEvent.click(screen.getByText(/Deletar/i));

    await waitFor(() => {
      expect(screen.getByText(/Erro ao deletar funcionário/i)).toBeInTheDocument();
    });
  });

  it('botão cancelar redireciona para /employee', async () => {
    const deleteMock = jest.fn();
    (useEmployee as jest.Mock).mockReturnValue({ employees: [mockEmployee], deleteEmployee: deleteMock });

    render(<EmployeeDeletePage params={{ id: '1' }} />);
    await waitFor(() => screen.getByText(/Cancelar/i));

    fireEvent.click(screen.getByText(/Cancelar/i));

    expect(pushMock).toHaveBeenCalledWith('/employee');
  });
});
