// app/ProtectedApp.tsx

'use client';

import { useAuth } from './hooks/useAuth';
import { usePathname, redirect } from 'next/navigation';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import './globals.css';

export default function ProtectedApp({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  const publicRoutes = ['/auth/login', '/auth/register'];

  // Redireciona apenas se não estiver em rota pública
  if (!user && !publicRoutes.includes(pathname)) {
    redirect('/auth/login');
  }

  const isPublicRoute = publicRoutes.includes(pathname);

  return (
    <>
      {!isPublicRoute && <Navbar />}
      <main>{children}</main>
      {!isPublicRoute && <Footer />}
    </>
  );
}
