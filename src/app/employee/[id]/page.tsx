// src/app/employee/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEmployee } from '../../hooks/useEmployee';
import { Employee } from '../../types/employee';
import styles from '../../employee/[id]/EmployeeDetails.module.css';

type PageProps = {
  params: { id: string };
};

export default function EmployeeDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const { employees } = useEmployee();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = Number(params.id);
    if (isNaN(id)) {
      router.replace('/employee');
      return;
    }

    const found = employees.find((e) => e.id === id) || null;
    setEmployee(found);
    setLoading(false);
  }, [params.id, employees, router]);

  if (loading) return <p className={styles.loading}>Carregando...</p>;
  if (!employee)
    return (
      <div className={styles.notFoundContainer}>
        <h1 className={styles.notFoundTitle}>Funcionário não encontrado</h1>
        <Link href="/employee" className={styles.btnPrimary}>
          Voltar para a lista
        </Link>
      </div>
    );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Detalhes do Funcionário</h1>

      <div className={styles.card}>
        <p>
          <strong className={styles.label}>Nome:</strong> {employee.name}
        </p>
        <p>
          <strong className={styles.label}>CPF:</strong> {employee.cpf}
        </p>
        <p>
          <strong className={styles.label}>Email:</strong> {employee.email}
        </p>
        <p>
          <strong className={styles.label}>Telefone:</strong>{' '}
          {employee.phone || 'Não informado'}
        </p>
        <p>
          <strong className={styles.label}>Endereço:</strong>{' '}
          {employee.address || 'Não informado'}
        </p>
        <p>
          <strong className={styles.label}>Cargo:</strong> {employee.position}
        </p>
        <p>
          <strong className={styles.label}>Departamento:</strong>{' '}
          {employee.department?.name || 'Não informado'}
        </p>
        <p>
          <strong className={styles.label}>Salário:</strong>{' '}
          {employee.salary.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </p>
        <p>
          <strong className={styles.label}>Data de Admissão:</strong>{' '}
          {new Date(employee.admissionDate).toLocaleDateString('pt-BR')}
        </p>
        <p>
          <strong className={styles.label}>Status:</strong>{' '}
          {employee.isActive ? 'Ativo' : 'Inativo'}
        </p>
      </div>

      <div className={styles.buttonGroup}>
        <Link href="/employee" className={styles.btnSecondary}>
          Voltar
        </Link>
        <Link href={`/employee/edit/${employee.id}`} className={styles.btnPrimary}>
          Editar
        </Link>
      </div>
    </div>
  );
}
