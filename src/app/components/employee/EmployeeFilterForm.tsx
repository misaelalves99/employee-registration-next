// app/employee/components/EmployeeFilterForm.tsx

'use client';

import { Dispatch, SetStateAction } from 'react';
import { POSITIONS } from '../../types/position';
import { Filters } from '../../types/employeeFilters';
import styles from './EmployeeFilterForm.module.css';

interface EmployeeFilterFormProps {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
}

export default function EmployeeFilterForm({ filters, setFilters }: EmployeeFilterFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form className={styles.form}>
      <div>
        <label htmlFor="departmentId" className={styles.label}>
          Departamento (ID)
        </label>
        <input
          type="number"
          id="departmentId"
          name="departmentId"
          className={styles.input}
          value={filters.departmentId}
          onChange={handleChange}
          placeholder="Ex: 1, 2, 3..."
          min={0}
        />
      </div>

      <div>
        <label htmlFor="position" className={styles.label}>
          Cargo
        </label>
        <select
          id="position"
          name="position"
          className={styles.select}
          value={filters.position}
          onChange={handleChange}
        >
          <option value="">Selecione</option>
          {POSITIONS.map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="isActive" className={styles.label}>
          Status
        </label>
        <select
          id="isActive"
          name="isActive"
          className={styles.select}
          value={filters.isActive}
          onChange={handleChange}
        >
          <option value="">Todos</option>
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </select>
      </div>

      <div>
        <label htmlFor="admissionDateFrom" className={styles.label}>
          Admissão de
        </label>
        <input
          type="date"
          id="admissionDateFrom"
          name="admissionDateFrom"
          className={styles.input}
          value={filters.admissionDateFrom}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="admissionDateTo" className={styles.label}>
          Até
        </label>
        <input
          type="date"
          id="admissionDateTo"
          name="admissionDateTo"
          className={styles.input}
          value={filters.admissionDateTo}
          onChange={handleChange}
        />
      </div>

      <button type="button" className={styles.button}>
        Filtrar
      </button>
    </form>
  );
}
