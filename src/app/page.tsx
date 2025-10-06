// app/page.tsx

import Link from 'next/link';
import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        Bem-vindo ao Sistema de Funcionários
      </h1>
      <p className={styles.description}>
        Gerencie todos os funcionários da empresa de forma simples, intuitiva e profissional.
        Cadastre, edite e visualize registros de desenvolvedores, gerentes e colaboradores com eficiência.
      </p>

      <Link href="/employee" className={styles.btnPrimary}>
        Ir para Funcionários
      </Link>
    </main>
  );
}
