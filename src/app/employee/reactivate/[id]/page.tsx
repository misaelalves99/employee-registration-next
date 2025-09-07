// app/employee/reactivate/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEmployee } from '../../../hooks/useEmployee';
import { EmployeeReactivatePageProps } from '../../../types/employeeReactivate';
import styles from './EmployeeReactivatePage.module.css';

export default function EmployeeReactivatePage({ params }: EmployeeReactivatePageProps) {
  const router = useRouter();
  const { employees, updateEmployee } = useEmployee();
  const [employee, setEmployee] = useState<typeof employees[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reactivating, setReactivating] = useState(false);

  useEffect(() => {
    const id = Number(params.id);
    const found = employees.find(emp => emp.id === id);

    if (!found) {
      setError('Funcionário não encontrado.');
    } else {
      setEmployee(found);
    }
    setLoading(false);
  }, [params.id, employees]);

  function handleReactivate() {
    if (!employee) return;

    setReactivating(true);
    setError(null);

    // Simula delay como antes
    setTimeout(() => {
      // Atualiza o funcionário para ativo
      updateEmployee(employee.id, { ...employee, isActive: true });

      // Redireciona para a lista
      router.push('/employee');
    }, 500);
  }

  if (loading) return <p className={styles.container}>Carregando...</p>;
  if (error) return <p className={`${styles.container} ${styles.errorText}`}>{error}</p>;
  if (!employee) return <p className={styles.container}>Funcionário não encontrado.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Reativar Funcionário</h1>
      <h4 className={styles.subtitle}>Tem certeza que deseja reativar este funcionário?</h4>

      <div className={styles.card}>
        <h5 className={styles.cardTitle}>{employee.name}</h5>
        <p><strong className={styles.textStrong}>CPF:</strong> {employee.cpf}</p>
        <p><strong className={styles.textStrong}>Email:</strong> {employee.email}</p>
        <p><strong className={styles.textStrong}>Cargo:</strong> {employee.position}</p>
        <p><strong className={styles.textStrong}>Departamento:</strong> {employee.department?.name || 'Não informado'}</p>
      </div>

      <div className={styles.buttonGroup}>
        <button
          onClick={handleReactivate}
          disabled={reactivating}
          className={styles.btnPrimary}
        >
          {reactivating ? 'Reativando...' : 'Reativar'}
        </button>
        <button
          onClick={() => router.push('/employee')}
          className={styles.btnSecondary}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
