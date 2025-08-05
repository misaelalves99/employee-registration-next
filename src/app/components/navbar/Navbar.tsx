// components/navbar/Navbar.tsx

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Navbar.module.css'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.brand}>
          Sistema de Funcionários
        </Link>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link
              href="/"
              className={`${pathname === '/' ? styles.activeLink : ''}`}
            >
              Início
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link
              href="/employee"
              className={`${pathname === '/employee' ? styles.activeLink : ''}`}
            >
              Funcionários
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link
              href="/privacy"
              className={`${pathname === '/privacy' ? styles.activeLink : ''}`}
            >
              Privacidade
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
