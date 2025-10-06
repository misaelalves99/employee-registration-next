// app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { EmployeeProvider } from './contexts/EmployeeProvider';
import { AuthProvider } from './contexts/AuthProvider';
import ProtectedApp from './ProtectedApp';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sistema de Funcionários',
  description: 'Aplicação convertida de ASP.NET MVC para Next.js 14+ com TypeScript',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <EmployeeProvider>
            <ProtectedApp>{children}</ProtectedApp>
          </EmployeeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
