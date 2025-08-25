// app/employee/page.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EmployeePage from './page'
import { mockEmployees } from '../lib/mock/employees'
import '@testing-library/jest-dom'

// Mock do EmployeeFilter e EmployeeDeleteModal para simplificar o teste
jest.mock('../components/employee/EmployeeFilter', () => ({
  __esModule: true,
  default: ({ onFilterChange }: any) => (
    <button onClick={() => onFilterChange({ position: 'Desenvolvedor' })}>Filtrar</button>
  ),
}))

jest.mock('../components/employee/EmployeeDeleteModal', () => ({
  __esModule: true,
  default: ({ onDeleted }: any) => (
    <button onClick={onDeleted}>Confirmar Deleção</button>
  ),
}))

describe('EmployeePage', () => {
  beforeEach(() => {
    // Reset do mockEmployees antes de cada teste
    mockEmployees.splice(0, mockEmployees.length, 
      { 
        id: 1, 
        name: 'João', 
        cpf: '123', 
        email: 'joao@example.com',
        position: 'Desenvolvedor' as const, 
        department: { id: 1, name: 'TI' }, 
        departmentId: 1,
        salary: 5000,
        admissionDate: '2023-01-01', 
        isActive: true 
      },
      { 
        id: 2, 
        name: 'Maria', 
        cpf: '456', 
        email: 'maria@example.com',
        position: 'Designer' as const, 
        department: { id: 2, name: 'Design' }, 
        departmentId: 2,
        salary: 4500,
        admissionDate: '2023-02-01', 
        isActive: false 
      }
    )
  })

  it('renderiza a lista de funcionários', () => {
    render(<EmployeePage />)
    expect(screen.getByText('João')).toBeInTheDocument()
    expect(screen.getByText('Maria')).toBeInTheDocument()
  })

  it('filtra funcionários pelo campo search', async () => {
    render(<EmployeePage />)
    const input = screen.getByPlaceholderText(/Buscar por nome/i)
    fireEvent.change(input, { target: { value: 'Maria' } })

    await waitFor(() => {
      expect(screen.getByText('Maria')).toBeInTheDocument()
      expect(screen.queryByText('João')).not.toBeInTheDocument()
    })
  })

  it('filtra funcionários via EmployeeFilter', async () => {
    render(<EmployeePage />)
    fireEvent.click(screen.getByText('Filtrar'))

    await waitFor(() => {
      expect(screen.getByText('João')).toBeInTheDocument()
      expect(screen.queryByText('Maria')).not.toBeInTheDocument()
    })
  })

  it('toggle de status ativa/inativa', async () => {
    render(<EmployeePage />)
    const button = screen.getAllByText('Inativar')[0]
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockEmployees[0].isActive).toBe(false)
      expect(screen.getByText('Ativar')).toBeInTheDocument()
    })
  })

  it('abre e confirma deleção de funcionário', async () => {
    render(<EmployeePage />)
    const deleteButton = screen.getAllByText('Deletar')[0]
    fireEvent.click(deleteButton)

    // O modal aparece, confirmamos deleção
    const confirmButton = screen.getByText('Confirmar Deleção')
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(mockEmployees.find(e => e.id === 1)).toBeUndefined()
    })
  })

  it('mostra mensagem quando não há funcionários', async () => {
    mockEmployees.splice(0, mockEmployees.length) // Remove todos
    render(<EmployeePage />)
    expect(screen.getByText(/Nenhum funcionário encontrado/i)).toBeInTheDocument()
  })
})
