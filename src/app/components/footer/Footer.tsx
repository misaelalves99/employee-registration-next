// app/components/footer/Footer.tsx

import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        © {new Date().getFullYear()} Sistema de Funcionários. Todos os direitos reservados.
      </p>
    </footer>
  )
}
