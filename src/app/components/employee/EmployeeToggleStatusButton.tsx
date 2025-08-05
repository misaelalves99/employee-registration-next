// app/components/employee/EmployeeToggleStatusButton.tsx

'use client';

import { useState } from 'react';
import styles from './EmployeeToggleStatusButton.module.css';

interface Props {
  employeeId: number;
  isActive: boolean;
  onToggle: (newStatus: boolean) => void;
}

export default function EmployeeToggleStatusButton({ employeeId, isActive, onToggle }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      const endpoint = isActive
        ? `/api/employee/inactivate/${employeeId}`
        : `/api/employee/reactivate/${employeeId}`;
      const res = await fetch(endpoint, { method: 'POST' });
      if (res.ok) {
        onToggle(!isActive);
      } else {
        alert('Erro ao atualizar status.');
      }
    } catch {
      alert('Erro ao atualizar status.');
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`${styles.button} ${isActive ? styles.inactive : styles.active}`}
      title={isActive ? 'Inativar Funcionário' : 'Ativar Funcionário'}
    >
      {isActive ? 'Inativo' : 'Ativo'}
    </button>
  );
}
