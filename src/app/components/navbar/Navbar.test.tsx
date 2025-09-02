// components/navbar/Navbar.test.tsx

import { render, screen } from '@testing-library/react'
import Navbar from './Navbar'

// Mock do usePathname do Next.js
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

describe('Navbar', () => {
  const { usePathname } = require('next/navigation')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza todos os links corretamente', () => {
    usePathname.mockReturnValue('/')
    render(<Navbar />)

    expect(screen.getByText('Sistema de Funcionários')).toBeInTheDocument()
    expect(screen.getByText('Início')).toBeInTheDocument()
    expect(screen.getByText('Funcionários')).toBeInTheDocument()
    expect(screen.getByText('Privacidade')).toBeInTheDocument()
  })

  it('marca o link Início como ativo quando pathname é /', () => {
    usePathname.mockReturnValue('/')
    render(<Navbar />)

    expect(screen.getByText('Início').className).toContain('activeLink')
    expect(screen.getByText('Funcionários').className).not.toContain('activeLink')
    expect(screen.getByText('Privacidade').className).not.toContain('activeLink')
  })

  it('marca o link Funcionários como ativo quando pathname é /employee', () => {
    usePathname.mockReturnValue('/employee')
    render(<Navbar />)

    expect(screen.getByText('Início').className).not.toContain('activeLink')
    expect(screen.getByText('Funcionários').className).toContain('activeLink')
    expect(screen.getByText('Privacidade').className).not.toContain('activeLink')
  })

  it('marca o link Privacidade como ativo quando pathname é /privacy', () => {
    usePathname.mockReturnValue('/privacy')
    render(<Navbar />)

    expect(screen.getByText('Início').className).not.toContain('activeLink')
    expect(screen.getByText('Funcionários').className).not.toContain('activeLink')
    expect(screen.getByText('Privacidade').className).toContain('activeLink')
  })
})
