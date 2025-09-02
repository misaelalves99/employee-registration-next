// src/app/employee/[id]/page.test.tsx

import { render, screen } from '@testing-library/react'
import EmployeeDetailsPage from './page'
import { getEmployeeById } from '../../lib/mock/employees'
import '@testing-library/jest-dom'

// Mock do getEmployeeById
jest.mock('../../lib/mock/employees', () => ({
  getEmployeeById: jest.fn(),
}))

// Mock do next/navigation notFound
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

describe('EmployeeDetailsPage', () => {
  const mockedGetEmployeeById = getEmployeeById as jest.Mock
  const { notFound } = require('next/navigation')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('chama notFound quando o id não é número', () => {
    render(<EmployeeDetailsPage params={{ id: 'abc' }} />)
    expect(notFound).toHaveBeenCalled()
  })

  it('exibe mensagem de não encontrado quando funcionário não existe', () => {
    mockedGetEmployeeById.mockReturnValueOnce(null)
    render(<EmployeeDetailsPage params={{ id: '999' }} />)

    expect(screen.getByText('Funcionário não encontrado')).toBeInTheDocument()
    expect(screen.getByText('Voltar para a lista')).toBeInTheDocument()
  })

  it('exibe corretamente os detalhes do funcionário quando encontrado', () => {
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
    }
    mockedGetEmployeeById.mockReturnValueOnce(employee)

    render(<EmployeeDetailsPage params={{ id: '1' }} />)

    // Título da página
    expect(screen.getByText('Detalhes do Funcionário')).toBeInTheDocument()

    // Campos principais
    expect(screen.getByText('Nome:')).toBeInTheDocument()
    expect(screen.getByText(employee.name)).toBeInTheDocument()
    expect(screen.getByText('CPF:')).toBeInTheDocument()
    expect(screen.getByText(employee.cpf)).toBeInTheDocument()
    expect(screen.getByText('Email:')).toBeInTheDocument()
    expect(screen.getByText(employee.email)).toBeInTheDocument()
    expect(screen.getByText('Telefone:')).toBeInTheDocument()
    expect(screen.getByText(employee.phone)).toBeInTheDocument()
    expect(screen.getByText('Endereço:')).toBeInTheDocument()
    expect(screen.getByText(employee.address)).toBeInTheDocument()
    expect(screen.getByText('Cargo:')).toBeInTheDocument()
    expect(screen.getByText(employee.position)).toBeInTheDocument()
    expect(screen.getByText('Departamento:')).toBeInTheDocument()
    expect(screen.getByText(employee.department.name)).toBeInTheDocument()

    // Salário formatado
    expect(screen.getByText('Salário:')).toBeInTheDocument()
    expect(screen.getByText('R$ 5.000,00')).toBeInTheDocument()

    // Data de admissão formatada
    expect(screen.getByText('Data de Admissão:')).toBeInTheDocument()
    expect(screen.getByText('01/01/2023')).toBeInTheDocument()

    // Status
    expect(screen.getByText('Status:')).toBeInTheDocument()
    expect(screen.getByText('Ativo')).toBeInTheDocument()

    // Botões
    expect(screen.getByText('Voltar')).toBeInTheDocument()
    expect(screen.getByText('Editar')).toBeInTheDocument()
  })

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
    }
    mockedGetEmployeeById.mockReturnValueOnce(employee)

    render(<EmployeeDetailsPage params={{ id: '2' }} />)

    expect(screen.getByText('Telefone:')).toBeInTheDocument()
    expect(screen.getByText('Não informado')).toBeInTheDocument()
    expect(screen.getByText('Endereço:')).toBeInTheDocument()
    expect(screen.getByText('Não informado')).toBeInTheDocument()
    expect(screen.getByText('Departamento:')).toBeInTheDocument()
    expect(screen.getByText('Não informado')).toBeInTheDocument()
    expect(screen.getByText('Inativo')).toBeInTheDocument()
  })
})
