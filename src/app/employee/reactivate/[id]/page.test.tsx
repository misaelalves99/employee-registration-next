// app/employee/reactivate/[id]/page.test.tsx

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import EmployeeReactivatePage from './page'
import { useRouter } from 'next/navigation'
import { getEmployeeById, updateMockEmployee } from '../../../lib/mock/employees'
import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('../../../lib/mock/employees', () => ({
  getEmployeeById: jest.fn(),
  updateMockEmployee: jest.fn(),
}))

describe('EmployeeReactivatePage', () => {
  const pushMock = jest.fn()

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
  }

  beforeEach(() => {
    jest.useFakeTimers()
    jest.mocked(useRouter).mockReturnValue({ push: pushMock } as any)
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('mostra loading inicialmente', () => {
    jest.mocked(getEmployeeById).mockReturnValue(mockEmployee)
    render(<EmployeeReactivatePage params={{ id: '1' }} />)
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument()
  })

  it('renderiza dados do funcionário e botão Reativar', async () => {
    jest.mocked(getEmployeeById).mockReturnValue(mockEmployee)

    render(<EmployeeReactivatePage params={{ id: '1' }} />)

    await waitFor(() => {
      expect(screen.getByText(mockEmployee.name)).toBeInTheDocument()
      expect(screen.getByText(/Reativar/i)).toBeInTheDocument()
    })
  })

  it('mostra erro quando funcionário não é encontrado', async () => {
    jest.mocked(getEmployeeById).mockReturnValue(null)

    render(<EmployeeReactivatePage params={{ id: '999' }} />)

    await waitFor(() => {
      expect(screen.getByText(/Funcionário não encontrado/i)).toBeInTheDocument()
    })
  })

  it('reativa funcionário com sucesso e redireciona', async () => {
    jest.mocked(getEmployeeById).mockReturnValue(mockEmployee)
    jest.mocked(updateMockEmployee).mockReturnValue(true)

    render(<EmployeeReactivatePage params={{ id: '1' }} />)

    fireEvent.click(screen.getByText(/Reativar/i))

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    await waitFor(() => {
      expect(updateMockEmployee).toHaveBeenCalledWith(mockEmployee.id, { isActive: true })
      expect(pushMock).toHaveBeenCalledWith('/employee')
    })
  })

  it('mostra erro se atualização falha', async () => {
    jest.mocked(getEmployeeById).mockReturnValue(mockEmployee)
    jest.mocked(updateMockEmployee).mockReturnValue(false)

    render(<EmployeeReactivatePage params={{ id: '1' }} />)

    fireEvent.click(screen.getByText(/Reativar/i))

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    await waitFor(() => {
      expect(screen.getByText(/Erro ao reativar funcionário/i)).toBeInTheDocument()
    })
  })
})
