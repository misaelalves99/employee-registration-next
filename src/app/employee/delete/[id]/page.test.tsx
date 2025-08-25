// app/employee/delete/[id]/page.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EmployeeDeletePage from './page'
import { useRouter } from 'next/navigation'
import { getMockEmployees, deleteMockEmployee } from '../../../lib/mock/mockData'
import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('../../../lib/mock/mockData', () => ({
  getMockEmployees: jest.fn(),
  deleteMockEmployee: jest.fn(),
}))

describe('EmployeeDeletePage', () => {
  const pushMock = jest.fn()

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
    phone: '',
    address: '',
  }

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock })
    jest.clearAllMocks()
  })

  it('mostra loading inicialmente', () => {
    (getMockEmployees as jest.Mock).mockReturnValue([mockEmployee])
    render(<EmployeeDeletePage params={{ id: '1' }} />)
    expect(screen.getByText(/Carregando funcionário/i)).toBeInTheDocument()
  })

  it('renderiza detalhes do funcionário quando encontrado', async () => {
    (getMockEmployees as jest.Mock).mockReturnValue([mockEmployee])
    render(<EmployeeDeletePage params={{ id: '1' }} />)

    await waitFor(() => {
      expect(screen.getByText(/Deletar Funcionário/i)).toBeInTheDocument()
      expect(screen.getByText(mockEmployee.name)).toBeInTheDocument()
      expect(screen.getByText(mockEmployee.cpf)).toBeInTheDocument()
      expect(screen.getByText(mockEmployee.email)).toBeInTheDocument()
      expect(screen.getByText(mockEmployee.position)).toBeInTheDocument()
      expect(screen.getByText(mockEmployee.department.name)).toBeInTheDocument()
    })
  })

  it('mostra erro quando funcionário não é encontrado', async () => {
    (getMockEmployees as jest.Mock).mockReturnValue([])
    render(<EmployeeDeletePage params={{ id: '999' }} />)

    await waitFor(() => {
      expect(screen.getByText(/Funcionário não encontrado/i)).toBeInTheDocument()
    })
  })

  it('deleta funcionário após confirmação e redireciona', async () => {
    (getMockEmployees as jest.Mock).mockReturnValue([mockEmployee])
    (deleteMockEmployee as jest.Mock).mockImplementation(() => {})

    // Mock do confirm para retornar true
    window.confirm = jest.fn(() => true)

    render(<EmployeeDeletePage params={{ id: '1' }} />)
    await waitFor(() => screen.getByText(/Deletar/i))

    fireEvent.click(screen.getByText(/Deletar/i))

    await waitFor(() => {
      expect(deleteMockEmployee).toHaveBeenCalledWith(1)
      expect(pushMock).toHaveBeenCalledWith('/employee')
    })
  })

  it('não deleta funcionário se confirmação for cancelada', async () => {
    (getMockEmployees as jest.Mock).mockReturnValue([mockEmployee])
    window.confirm = jest.fn(() => false)

    render(<EmployeeDeletePage params={{ id: '1' }} />)
    await waitFor(() => screen.getByText(/Deletar/i))

    fireEvent.click(screen.getByText(/Deletar/i))

    await waitFor(() => {
      expect(deleteMockEmployee).not.toHaveBeenCalled()
      expect(pushMock).not.toHaveBeenCalled()
    })
  })
})
