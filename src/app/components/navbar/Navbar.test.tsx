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

  it('renderiza os links corretamente', () => {
    usePathname.mockReturnValue('/')
    render(<Navbar />)

    expect(screen.getByText('Sistema de Funcionários')).toBeInTheDocument()
    expect(screen.getByText('Início')).toBeInTheDocument()
    expect(screen.getByText('Funcionários')).toBeInTheDocument()
    expect(screen.getByText('Privacidade')).toBeInTheDocument()
  })

  it('marca o link ativo de acordo com o pathname', () => {
    usePathname.mockReturnValue('/employee')
    render(<Navbar />)

    const homeLink = screen.getByText('Início')
    const employeeLink = screen.getByText('Funcionários')
    const privacyLink = screen.getByText('Privacidade')

    expect(homeLink.className).not.toContain('activeLink')
    expect(employeeLink.className).toContain('activeLink')
    expect(privacyLink.className).not.toContain('activeLink')
  })

  it('marca o link de privacidade como ativo quando pathname é /privacy', () => {
    usePathname.mockReturnValue('/privacy')
    render(<Navbar />)

    const privacyLink = screen.getByText('Privacidade')
    expect(privacyLink.className).toContain('activeLink')
  })
})
