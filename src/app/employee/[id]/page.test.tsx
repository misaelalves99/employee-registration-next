// src/app/employee/[id]/page.test.tsx
import { render, screen } from '@testing-library/react';
import EmployeeDetailsPage from './page';
import { useEmployee } from '../../hooks/useEmployee';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

// Mock do useEmployee
jest.mock('../../hooks/useEmployee', () => ({
  useEmployee: jest.fn(),
}));

// Mock do useRouter
const replaceMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

describe('EmployeeDetailsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redireciona quando o id não é número', () => {
    (useEmployee as jest.Mock).mockReturnValue({ employees: [] });
    render(<EmployeeDetailsPage params={{ id: 'abc' }} />);
    expect(replaceMock).toHaveBeenCalledWith('/employee');
  });

  it('exibe mensagem de não encontrado quando funcionário não existe', () => {
    (useEmployee as jest.Mock).mockReturnValue({ employees: [] });
    render(<EmployeeDetailsPage params={{ id: '999' }} />);

    expect(screen.getByText('Funcionário não encontrado')).toBeInTheDocument();
    expect(screen.getByText('Voltar para a lista')).toBeInTheDocument();
  });

  it('exibe corretamente os detalhes do funcionário encontrado', () => {
    const employee = {
      id: 1,
      name: 'João Silva',
      cpf: '123.456.789-00',
      email: 'joao@example.com',
      phone: '11999999999',
      address: 'Rua A, 123',
      position: 'Desenvolvedor',
      department: { id: 1, name: 'TI' },
      salary: 5000,
      admissionDate: '2023-01-01',
      isActive: true,
    };
    (useEmployee as jest.Mock).mockReturnValue({ employees: [employee] });

    render(<EmployeeDetailsPage params={{ id: '1' }} />);

    expect(screen.getByText('Detalhes do Funcionário')).toBeInTheDocument();
    expect(screen.getByText('Nome:')).toBeInTheDocument();
    expect(screen.getByText(employee.name)).toBeInTheDocument();
    expect(screen.getByText('CPF:')).toBeInTheDocument();
    expect(screen.getByText(employee.cpf)).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText(employee.email)).toBeInTheDocument();
    expect(screen.getByText('Telefone:')).toBeInTheDocument();
    expect(screen.getByText(employee.phone)).toBeInTheDocument();
    expect(screen.getByText('Endereço:')).toBeInTheDocument();
    expect(screen.getByText(employee.address)).toBeInTheDocument();
    expect(screen.getByText('Cargo:')).toBeInTheDocument();
    expect(screen.getByText(employee.position)).toBeInTheDocument();
    expect(screen.getByText('Departamento:')).toBeInTheDocument();
    expect(screen.getByText(employee.department.name)).toBeInTheDocument();
    expect(screen.getByText('Salário:')).toBeInTheDocument();
    expect(screen.getByText('R$ 5.000,00')).toBeInTheDocument();
    expect(screen.getByText('Data de Admissão:')).toBeInTheDocument();
    expect(screen.getByText('01/01/2023')).toBeInTheDocument();
    expect(screen.getByText('Status:')).toBeInTheDocument();
    expect(screen.getByText('Ativo')).toBeInTheDocument();
    expect(screen.getByText('Voltar')).toBeInTheDocument();
    expect(screen.getByText('Editar')).toBeInTheDocument();
  });

  it('exibe "Não informado" para campos opcionais vazios', () => {
    const employee = {
      id: 2,
      name: 'Maria Souza',
      cpf: '987.654.321-00',
      email: 'maria@example.com',
      phone: '',
      address: '',
      position: 'Analista',
      department: null,
      salary: 4000,
      admissionDate: '2022-06-15',
      isActive: false,
    };
    (useEmployee as jest.Mock).mockReturnValue({ employees: [employee] });

    render(<EmployeeDetailsPage params={{ id: '2' }} />);

    expect(screen.getByText('Telefone:')).toBeInTheDocument();
    expect(screen.getByText('Não informado')).toBeInTheDocument();
    expect(screen.getByText('Endereço:')).toBeInTheDocument();
    expect(screen.getByText('Não informado')).toBeInTheDocument();
    expect(screen.getByText('Departamento:')).toBeInTheDocument();
    expect(screen.getByText('Não informado')).toBeInTheDocument();
    expect(screen.getByText('Inativo')).toBeInTheDocument();
  });
});
