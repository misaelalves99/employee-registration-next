// app/employee/edit/[id]/page.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EditEmployeePage from './page'
import { useRouter } from 'next/navigation'
import { getEmployeeById, updateMockEmployee } from '../../../lib/mock/employees'
import { getMockDepartments } from '../../../lib/mock/departments'
import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('../../../lib/mock/employees', () => ({
  getEmployeeById: jest.fn(),
  updateMockEmployee: jest.fn(),
}))

jest.mock('../../../lib/mock/departments', () => ({
  getMockDepartments: jest.fn(),
}))

describe('EditEmployeePage', () => {
  const pushMock = jest.fn()

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
  }

  const mockDepartments = [{ id: 1, name: 'TI' }, { id: 2, name: 'RH' }]

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock })
    jest.clearAllMocks()
  })

  it('mostra loading inicialmente', () => {
    (getEmployeeById as jest.Mock).mockReturnValue(mockEmployee)
    (getMockDepartments as jest.Mock).mockResolvedValue(mockDepartments)
    render(<EditEmployeePage params={{ id: '1' }} />)
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument()
  })

  it('renderiza formulário preenchido com dados do funcionário', async () => {
    (getEmployeeById as jest.Mock).mockReturnValue(mockEmployee)
    (getMockDepartments as jest.Mock).mockResolvedValue(mockDepartments)

    render(<EditEmployeePage params={{ id: '1' }} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue(mockEmployee.name)).toBeInTheDocument()
      expect(screen.getByDisplayValue(mockEmployee.cpf)).toBeInTheDocument()
      expect(screen.getByDisplayValue(mockEmployee.email)).toBeInTheDocument()
      expect(screen.getByDisplayValue(mockEmployee.phone)).toBeInTheDocument()
      expect(screen.getByDisplayValue(mockEmployee.address)).toBeInTheDocument()
      expect(screen.getByDisplayValue(mockEmployee.position)).toBeInTheDocument()
      expect(screen.getByDisplayValue(String(mockEmployee.departmentId))).toBeInTheDocument()
      expect(screen.getByDisplayValue(String(mockEmployee.salary))).toBeInTheDocument()
    })
  })

  it('mostra erro quando funcionário não é encontrado', async () => {
    (getEmployeeById as jest.Mock).mockReturnValue(null)
    (getMockDepartments as jest.Mock).mockResolvedValue(mockDepartments)

    render(<EditEmployeePage params={{ id: '999' }} />)

    await waitFor(() => {
      expect(screen.getByText(/Funcionário não encontrado/i)).toBeInTheDocument()
    })
  })

  it('salva dados do funcionário e redireciona', async () => {
    (getEmployeeById as jest.Mock).mockReturnValue(mockEmployee)
    (getMockDepartments as jest.Mock).mockResolvedValue(mockDepartments)
    (updateMockEmployee as jest.Mock).mockReturnValue(true)

    render(<EditEmployeePage params={{ id: '1' }} />)
    await waitFor(() => screen.getByText(/Salvar/i))

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'João Atualizado' } })
    fireEvent.click(screen.getByText(/Salvar/i))

    await waitFor(() => {
      expect(updateMockEmployee).toHaveBeenCalledWith(mockEmployee.id, expect.objectContaining({ name: 'João Atualizado' }))
      expect(pushMock).toHaveBeenCalledWith('/employee')
    })
  })

  it('mostra erro quando updateMockEmployee falha', async () => {
    (getEmployeeById as jest.Mock).mockReturnValue(mockEmployee)
    (getMockDepartments as jest.Mock).mockResolvedValue(mockDepartments)
    (updateMockEmployee as jest.Mock).mockReturnValue(false)

    render(<EditEmployeePage params={{ id: '1' }} />)
    await waitFor(() => screen.getByText(/Salvar/i))

    fireEvent.click(screen.getByText(/Salvar/i))

    await waitFor(() => {
      expect(screen.getByText(/Erro ao salvar dados do funcionário/i)).toBeInTheDocument()
    })
  })
})
