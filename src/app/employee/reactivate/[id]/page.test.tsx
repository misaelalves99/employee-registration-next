// app/employee/reactivate/[id]/page.test.tsx
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import EmployeeReactivatePage from './page';
import { useRouter } from 'next/navigation';
import { useEmployee } from '../../../hooks/useEmployee';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../../hooks/useEmployee', () => ({
  useEmployee: jest.fn(),
}));

describe('EmployeeReactivatePage', () => {
  const pushMock = jest.fn();

  const mockEmployee = {
    id: 1,
    name: 'João Silva',
    cpf: '123.456.789-00',
    email: 'joao@test.com',
    phone: '(11) 99999-9999',
    address: 'Rua Teste, 123',
    position: 'Desenvolvedor' as const,
    department: { id: 1, name: 'TI' },
    departmentId: 1,
    salary: 5000,
    admissionDate: '2023-01-01',
    isActive: false,
  };

  beforeEach(() => {
    jest.useFakeTimers();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('mostra loading inicialmente', () => {
    (useEmployee as jest.Mock).mockReturnValue({ employees: [mockEmployee], updateEmployee: jest.fn() });
    render(<EmployeeReactivatePage params={{ id: '1' }} />);
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
  });

  it('renderiza dados do funcionário e botão Reativar', async () => {
    (useEmployee as jest.Mock).mockReturnValue({ employees: [mockEmployee], updateEmployee: jest.fn() });
    render(<EmployeeReactivatePage params={{ id: '1' }} />);

    await waitFor(() => {
      expect(screen.getByText(mockEmployee.name)).toBeInTheDocument();
      expect(screen.getByText(/Reativar/i)).toBeInTheDocument();
    });
  });

  it('mostra erro quando funcionário não é encontrado', async () => {
    (useEmployee as jest.Mock).mockReturnValue({ employees: [], updateEmployee: jest.fn() });
    render(<EmployeeReactivatePage params={{ id: '999' }} />);

    await waitFor(() => {
      expect(screen.getByText(/Funcionário não encontrado/i)).toBeInTheDocument();
    });
  });

  it('reativa funcionário com sucesso e redireciona', async () => {
    const updateMock = jest.fn();
    (useEmployee as jest.Mock).mockReturnValue({ employees: [mockEmployee], updateEmployee: updateMock });

    render(<EmployeeReactivatePage params={{ id: '1' }} />);

    const btn = screen.getByText(/Reativar/i);
    fireEvent.click(btn);

    expect(btn).toBeDisabled();
    expect(btn.textContent).toBe('Reativando...');

    act(() => jest.advanceTimersByTime(500));

    await waitFor(() => {
      expect(updateMock).toHaveBeenCalledWith(mockEmployee.id, { ...mockEmployee, isActive: true });
      expect(pushMock).toHaveBeenCalledWith('/employee');
    });
  });

  it('botão Cancelar redireciona', async () => {
    (useEmployee as jest.Mock).mockReturnValue({ employees: [mockEmployee], updateEmployee: jest.fn() });

    render(<EmployeeReactivatePage params={{ id: '1' }} />);
    await waitFor(() => screen.getByText(/Cancelar/i));

    fireEvent.click(screen.getByText(/Cancelar/i));
    expect(pushMock).toHaveBeenCalledWith('/employee');
  });
});
