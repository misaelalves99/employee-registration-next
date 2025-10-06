// app/auth/login/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import Link from 'next/link';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import SocialButton from '@/app/components/ui/SocialButton';
import styles from '../AuthForm.module.css';

export default function LoginPage() {
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) router.push('/employee');
  };

  const handleGoogleLogin = async () => {
    const success = await loginWithGoogle();
    if (success) router.push('/employee');
  };

  const handleFacebookLogin = async () => {
    const success = await loginWithFacebook();
    if (success) router.push('/employee');
  };

  return (
    <div className={styles.container}>
      {/* Lado esquerdo: imagem e texto */}
      <div className={styles.imageSide}>
        <div className={styles.overlay}>
          <h2 className={styles.welcomeTitle}>Compromisso, Agilidade e Excelência</h2>
          <p className={styles.welcomeText}>
            Valorizando inovação, eficiência e confiança em todas as operações.
          </p>
        </div>

        <img
          src="/assets/auth-banner.png"
          alt="Employee Management"
        />
      </div>

      {/* Lado direito: Formulário */}
      <div className={styles.formSide}>
        <h1 className={styles.title}>Login</h1>
        <p className={styles.subtitle}>Bem-vindo! Entre na sua conta ou registre-se para começar.</p>

        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.btnPrimary}>Entrar</button>
        </form>

        <div className={styles.divider}>ou</div>

        <div className={styles.socialButtons}>
          <SocialButton
            icon={FaGoogle}
            color="#DB4437"
            ariaLabel="Entrar com Google"
            onClick={handleGoogleLogin}
          />
          <SocialButton
            icon={FaFacebookF}
            color="#1877F2"
            ariaLabel="Entrar com Facebook"
            onClick={handleFacebookLogin}
          />
        </div>
        <p className={styles.text}>
          Não tem uma conta?{' '}
          <Link href="/auth/register" className={styles.link}>Registre-se</Link>
        </p>
      </div>
    </div>
  );
}
