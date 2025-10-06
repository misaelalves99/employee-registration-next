// components/navbar/Navbar.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FaUserCircle } from 'react-icons/fa'
import { useAuth } from '@/app/hooks/useAuth'
import styles from './Navbar.module.css'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => setMenuOpen(prev => !prev)
  const toggleProfile = () => setProfileOpen(prev => !prev)

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  const isActive = (path: string) => pathname === path

  // Fecha dropdown de perfil ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.brand}>
          Sistema de Funcionários
        </Link>

        {/* Menu Links + Perfil */}
        <div className={styles.menuProfileWrapper}>
          <ul className={`${styles.navList} ${menuOpen ? styles.navListActive : ''}`}>
            <li className={styles.navItem}>
              <Link href="/" className={isActive('/') ? styles.activeLink : ''} onClick={() => setMenuOpen(false)}>
                Início
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/employee" className={isActive('/employee') ? styles.activeLink : ''} onClick={() => setMenuOpen(false)}>
                Funcionários
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/privacy" className={isActive('/privacy') ? styles.activeLink : ''} onClick={() => setMenuOpen(false)}>
                Privacidade
              </Link>
            </li>
          </ul>

          {/* Mobile Toggle */}
          <button
            className={styles.menuToggle}
            onClick={toggleMenu}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {menuOpen ? '✕' : '☰'}
          </button>

          {/* Perfil */}
          <div className={styles.profileWrapper} ref={profileRef}>
            <button
              className={styles.profileBtn}
              onClick={toggleProfile}
              aria-label="Abrir menu de perfil"
            >
              <FaUserCircle size={28} />
            </button>
            {profileOpen && (
              <div className={styles.profileMenu}>
                <button className={styles.profileMenuItem} onClick={handleLogout}>
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
