// app/privacy/page.tsx

import styles from './PrivacyPage.module.css';

export default function PrivacyPage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Política de Privacidade</h1>
      <p className={styles.text}>
        Sua privacidade é importante para nós. Esta aplicação não coleta dados pessoais dos
        usuários. Todas as informações inseridas são de uso exclusivo para fins de cadastro e
        gerenciamento interno.
      </p>
    </main>
  );
}
