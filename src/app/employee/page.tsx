// app/employee/page.tsx

// app/employee/page.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Employee } from '../types/employee';
import EmployeeFilter from '../components/employee/EmployeeFilter';
import EmployeeDeleteModal from '../components/employee/EmployeeDeleteModal';
import { mockEmployees } from '../lib/mock/employees';
import styles from './EmployeePage.module.css';

interface EmployeeFilters {
  search?: string;
  departmentId?: number;
  position?: string;
  isActive?: boolean;
  admissionDateFrom?: string;
  admissionDateTo?: string;
}

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<EmployeeFilters>({});
  const [selectedEmployeeToDelete, setSelectedEmployeeToDelete] = useState<Employee | null>(null);

  const fetchEmployees = useCallback(() => {
    let filtered = [...mockEmployees];

    // 🔎 Filtro por texto de busca (query tem prioridade sobre filters.search)
    const searchTerm = query || filters.search;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.name.toLowerCase().includes(q) ||
          emp.email.toLowerCase().includes(q) ||
          emp.cpf.includes(q) ||
          emp.phone?.includes(q)
      );
    }

    // 📌 Outros filtros
    if (filters.isActive !== undefined) {
      filtered = filtered.filter((emp) => emp.isActive === filters.isActive);
    }
    if (filters.departmentId) {
      filtered = filtered.filter((emp) => emp.department?.id === filters.departmentId);
    }
    if (filters.position) {
      filtered = filtered.filter((emp) => emp.position === filters.position);
    }
    if (filters.admissionDateFrom) {
      const from = new Date(filters.admissionDateFrom);
      if (!isNaN(from.getTime())) {
        filtered = filtered.filter((emp) => new Date(emp.admissionDate) >= from);
      }
    }
    if (filters.admissionDateTo) {
      const to = new Date(filters.admissionDateTo);
      if (!isNaN(to.getTime())) {
        filtered = filtered.filter((emp) => new Date(emp.admissionDate) <= to);
      }
    }

    setEmployees(filtered);
  }, [query, filters]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const openDeleteModal = (employee: Employee) => {
    setSelectedEmployeeToDelete(employee);
  };

  const closeDeleteModal = () => {
    setSelectedEmployeeToDelete(null);
  };

  const handleDeleteConfirmed = () => {
    if (!selectedEmployeeToDelete) return;
    const updated = mockEmployees.filter((e) => e.id !== selectedEmployeeToDelete.id);
    mockEmployees.splice(0, mockEmployees.length, ...updated);
    fetchEmployees();
    closeDeleteModal();
  };

  const toggleActiveStatus = (emp: Employee) => {
    const index = mockEmployees.findIndex((e) => e.id === emp.id);
    if (index !== -1) {
      mockEmployees[index].isActive = !mockEmployees[index].isActive;
      fetchEmployees();
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Lista de Funcionários</h1>

      <div className={styles.contentWrapper}>
        {/* Sidebar com filtros */}
        <aside className={styles.sidebar}>
          <EmployeeFilter onFilterChange={setFilters} />
        </aside>

        {/* Seção principal */}
        <section className={styles.rightSection}>
          <div className={styles.topBar}>
            <Link href="/employee/create" className={styles.btnPrimary}>
              Novo Funcionário
            </Link>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome, CPF, e-mail ou telefone..."
              className={styles.searchInput}
              aria-label="Campo de busca de funcionários"
            />
          </div>

          {employees.length === 0 ? (
            <p className={styles.noResults}>Nenhum funcionário encontrado.</p>
          ) : (
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  <th className={styles.th}>Nome</th>
                  <th className={styles.th}>CPF</th>
                  <th className={styles.th}>Cargo</th>
                  <th className={styles.th}>Departamento</th>
                  <th className={styles.th}>Admissão</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} className={styles.trHover}>
                    <td className={styles.td}>{emp.name}</td>
                    <td className={styles.td}>{emp.cpf}</td>
                    <td className={styles.td}>{emp.position}</td>
                    <td className={styles.td}>{emp.department?.name || '-'}</td>
                    <td className={styles.td}>
                      {new Date(emp.admissionDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className={styles.td}>{emp.isActive ? 'Ativo' : 'Inativo'}</td>
                    <td className={`${styles.td} ${styles.actions}`}>
                      <Link
                        href={`/employee/${emp.id}`}
                        className={`${styles.btn} ${styles.btnInfo}`}
                      >
                        Detalhes
                      </Link>
                      <Link
                        href={`/employee/edit/${emp.id}`}
                        className={`${styles.btn} ${styles.btnWarning}`}
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => toggleActiveStatus(emp)}
                        className={`${styles.btn} ${
                          emp.isActive ? styles.btnSecondary : styles.btnSuccess
                        }`}
                        aria-label={emp.isActive ? 'Inativar funcionário' : 'Ativar funcionário'}
                      >
                        {emp.isActive ? 'Inativar' : 'Ativar'}
                      </button>
                      <button
                        onClick={() => openDeleteModal(emp)}
                        className={`${styles.btn} ${styles.btnDanger}`}
                        aria-label="Excluir funcionário"
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      {/* Modal de exclusão */}
      {selectedEmployeeToDelete && (
        <EmployeeDeleteModal
          employee={selectedEmployeeToDelete}
          onClose={closeDeleteModal}
          onDeleted={handleDeleteConfirmed}
        />
      )}
    </main>
  );
}
