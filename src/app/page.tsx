// app/page.tsx

import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        Bem-vindo ao Sistema de Funcionários
      </h1>
      <p className={styles.description}>
        Este sistema permite o cadastro, edição e gerenciamento de funcionários da empresa.
        Desenvolvido para gerenciar registros de desenvolvedores, gerentes e funcionários de forma simples e intuitiva.
      </p>
    </main>
  );
}
