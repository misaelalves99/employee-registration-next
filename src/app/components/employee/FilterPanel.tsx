// app/employee/components/FilterPanel.tsx

import React, { useState } from 'react'
import styles from './FilterPanel.module.css'

interface FilterPanelProps {
  onFilterChange: (filters: { position?: string; departmentId?: number }) => void
}

export default function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [position, setPosition] = useState('')
  const [departmentId, setDepartmentId] = useState('')

  const handleFilter = () => {
    onFilterChange({
      position: position || undefined,
      departmentId: departmentId ? Number(departmentId) : undefined,
    })
  }

  return (
    <aside className={styles.container}>
      <h2 className={styles.title}>Filtros</h2>

      <div className={styles.field}>
        <label htmlFor="position" className={styles.label}>Cargo</label>
        <input
          type="text"
          id="position"
          value={position}
          onChange={e => setPosition(e.target.value)}
          className={styles.input}
          placeholder="Cargo"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="departmentId" className={styles.label}>Departamento</label>
        <input
          type="number"
          id="departmentId"
          value={departmentId}
          onChange={e => setDepartmentId(e.target.value)}
          className={styles.input}
          placeholder="ID do departamento"
        />
      </div>

      <button
        onClick={handleFilter}
        className={styles.button}
      >
        Aplicar Filtros
      </button>
    </aside>
  )
}
