// app/employee/page.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmployeePage from './page';
import { useEmployee } from '../hooks/useEmployee';
import '@testing-library/jest-dom';

// Mock do EmployeeFilter e EmployeeDeleteModal
jest.mock('../components/employee/EmployeeFilter', () => ({
  __esModule: true,
  default: ({ onFilterChange }: any) => (
    <button onClick={() => onFilterChange({ position: 'Desenvolvedor' })}>Filtrar</button>
  ),
}));

jest.mock('../components/employee/EmployeeDeleteModal', () => ({
  __esModule: true,
  default: ({ onDeleted }: any) => (
    <button onClick={onDeleted}>Confirmar Deleção</button>
  ),
}));

jest.mock('../hooks/useEmployee');

describe('EmployeePage', () => {
  const updateEmployeeMock = jest.fn();
  const deleteEmployeeMock = jest.fn();

  const mockEmployees = [
    { id: 1, name: 'João', cpf: '123', email: 'joao@example.com', position: 'Desenvolvedor' as const, department: { id: 1, name: 'TI' }, departmentId: 1, salary: 5000, admissionDate: '2023-01-01', isActive: true },
    { id: 2, name: 'Maria', cpf: '456', email: 'maria@example.com', position: 'Designer' as const, department: { id: 2, name: 'Design' }, departmentId: 2, salary: 4500, admissionDate: '2023-02-01', isActive: false },
  ];

  beforeEach(() => {
    (useEmployee as jest.Mock).mockReturnValue({
      employees: [...mockEmployees],
      updateEmployee: updateEmployeeMock,
      deleteEmployee: deleteEmployeeMock,
    });
    jest.clearAllMocks();
  });

  it('renderiza a lista de funcionários', () => {
    render(<EmployeePage />);
    expect(screen.getByText('João')).toBeInTheDocument();
    expect(screen.getByText('Maria')).toBeInTheDocument();
  });

  it('filtra funcionários pelo campo search', async () => {
    render(<EmployeePage />);
    const input = screen.getByPlaceholderText(/Buscar por nome/i);
    fireEvent.change(input, { target: { value: 'Maria' } });

    await waitFor(() => {
      expect(screen.getByText('Maria')).toBeInTheDocument();
      expect(screen.queryByText('João')).not.toBeInTheDocument();
    });
  });

  it('filtra funcionários via EmployeeFilter', async () => {
    render(<EmployeePage />);
    fireEvent.click(screen.getByText('Filtrar'));

    await waitFor(() => {
      expect(screen.getByText('João')).toBeInTheDocument();
      expect(screen.queryByText('Maria')).not.toBeInTheDocument();
    });
  });

  it('toggle de status ativa/inativa', async () => {
    render(<EmployeePage />);
    const button = screen.getAllByText('Inativar')[0];
    
    // Simula confirmação
    window.confirm = jest.fn(() => true);
    fireEvent.click(button);

    await waitFor(() => {
      expect(updateEmployeeMock).toHaveBeenCalledWith(1, expect.objectContaining({ isActive: false }));
    });
  });

  it('não altera status se confirmação for cancelada', async () => {
    render(<EmployeePage />);
    const button = screen.getAllByText('Inativar')[0];
    
    window.confirm = jest.fn(() => false);
    fireEvent.click(button);

    await waitFor(() => {
      expect(updateEmployeeMock).not.toHaveBeenCalled();
    });
  });

  it('abre e confirma deleção de funcionário', async () => {
    render(<EmployeePage />);
    const deleteButton = screen.getAllByText('Deletar')[0];
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByText('Confirmar Deleção');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(deleteEmployeeMock).toHaveBeenCalledWith(1);
    });
  });

  it('mostra mensagem quando não há funcionários', async () => {
    (useEmployee as jest.Mock).mockReturnValue({ employees: [], updateEmployee: updateEmployeeMock, deleteEmployee: deleteEmployeeMock });
    render(<EmployeePage />);
    expect(screen.getByText(/Nenhum funcionário encontrado/i)).toBeInTheDocument();
  });
});
