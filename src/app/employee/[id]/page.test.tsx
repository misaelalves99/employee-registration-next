// src/app/employee/[id]/page.test.tsx

import { render, screen } from '@testing-library/react'
import EmployeeDetailsPage from './page'
import { getEmployeeById } from '../../lib/mock/employees'
import '@testing-library/jest-dom'
import Link from 'next/link'

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

  it('exibe detalhes do funcionário quando encontrado', () => {
    const employee = {
      id: 1,
      name: 'João Silva',
      cpf: '123.456.789-00',
      email: 'joao@example.com',
      phone: '123456789',
      address: 'Rua A, 123',
      position: 'Desenvolvedor',
      department: { id: 1, name: 'TI' },
      salary: 5000,
      admissionDate: '2023-01-01',
      isActive: true,
    }
    mockedGetEmployeeById.mockReturnValueOnce(employee)

    render(<EmployeeDetailsPage params={{ id: '1' }} />)

    expect(screen.getByText('Detalhes do Funcionário')).toBeInTheDocument()
    expect(screen.getByText(`Nome:`)).toBeInTheDocument()
    expect(screen.getByText(employee.name)).toBeInTheDocument()
    expect(screen.getByText(employee.cpf)).toBeInTheDocument()
    expect(screen.getByText(employee.email)).toBeInTheDocument()
    expect(screen.getByText(employee.phone)).toBeInTheDocument()
    expect(screen.getByText(employee.address)).toBeInTheDocument()
    expect(screen.getByText(employee.position)).toBeInTheDocument()
    expect(screen.getByText(employee.department.name)).toBeInTheDocument()
    expect(screen.getByText('R$ 5.000,00')).toBeInTheDocument() // BRL formatting
    expect(screen.getByText('01/01/2023')).toBeInTheDocument() // date formatting
    expect(screen.getByText('Ativo')).toBeInTheDocument()
    expect(screen.getByText('Voltar')).toBeInTheDocument()
    expect(screen.getByText('Editar')).toBeInTheDocument()
  })
})
