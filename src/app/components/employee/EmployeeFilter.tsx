// app/components/employee/EmployeeFilter.tsx

'use client';

import { useState, FormEvent } from 'react';
import { POSITIONS, Position } from '@/app/types/position';
import styles from './EmployeeFilter.module.css';

interface EmployeeFilterProps {
  onFilterChange: (filters: {
    search?: string;
    departmentId?: number;
    position?: Position | '';
    isActive?: boolean;
    admissionDateFrom?: string;
    admissionDateTo?: string;
  }) => void;
}

export default function EmployeeFilter({ onFilterChange }: EmployeeFilterProps) {
  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [position, setPosition] = useState<Position | ''>('');
  const [isActive, setIsActive] = useState<boolean | ''>('');
  const [admissionDateFrom, setAdmissionDateFrom] = useState('');
  const [admissionDateTo, setAdmissionDateTo] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const normalizedIsActive = isActive === '' ? undefined : isActive;
    onFilterChange({
      search: search || undefined,
      departmentId: departmentId ? Number(departmentId) : undefined,
      position: position || undefined,
      isActive: normalizedIsActive,
      admissionDateFrom: admissionDateFrom || undefined,
      admissionDateTo: admissionDateTo || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div>
        <label htmlFor="search" className={styles.label}>Buscar</label>
        <input
          type="text"
          id="search"
          placeholder="Nome, CPF, email ou telefone..."
          className={styles.input}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="departmentId" className={styles.label}>Departamento (ID)</label>
        <input
          type="number"
          id="departmentId"
          placeholder="Ex: 1, 2, 3..."
          className={styles.input}
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="position" className={styles.label}>Cargo</label>
        <select
          id="position"
          className={styles.select}
          value={position}
          onChange={(e) => setPosition(e.target.value as Position | '')}
        >
          <option value="">Selecione</option>
          {POSITIONS.map((pos) => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="isActive" className={styles.label}>Status</label>
        <select
          id="isActive"
          className={styles.select}
          value={isActive === '' ? '' : isActive ? 'true' : 'false'}
          onChange={(e) => {
            const value = e.target.value;
            setIsActive(value === '' ? '' : value === 'true');
          }}
        >
          <option value="">Todos</option>
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </select>
      </div>

      <div>
        <label htmlFor="admissionDateFrom" className={styles.label}>Admissão de</label>
        <input
          type="date"
          id="admissionDateFrom"
          className={styles.input}
          value={admissionDateFrom}
          onChange={(e) => setAdmissionDateFrom(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="admissionDateTo" className={styles.label}>Até</label>
        <input
          type="date"
          id="admissionDateTo"
          className={styles.input}
          value={admissionDateTo}
          onChange={(e) => setAdmissionDateTo(e.target.value)}
        />
      </div>

      <button type="submit" className={styles.button}>
        Filtrar
      </button>
    </form>
  );
}
