// app/employee/page.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import EmployeeFilter from '../components/employee/EmployeeFilter';
import EmployeeDeleteModal from '../components/employee/EmployeeDeleteModal';
import { useEmployee } from '../hooks/useEmployee';
import { 
  FaInfoCircle, 
  FaEdit, 
  FaTrash, 
  FaUserSlash, 
  FaUserCheck, 
  FaPlus, 
  FaSearch 
} from 'react-icons/fa';
import styles from './EmployeePage.module.css';

interface EmployeeFilters {
  search?: string;
  departmentId?: number;
  position?: string;
  isActive?: boolean;
}

export default function EmployeePage() {
  const { employees: allEmployees, updateEmployee, deleteEmployee } = useEmployee();
  const [employees, setEmployees] = useState(allEmployees);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<EmployeeFilters>({});
  const [selectedEmployeeToDelete, setSelectedEmployeeToDelete] = useState<number | null>(null);

  const fetchEmployees = useCallback(() => {
    let filtered = [...allEmployees];

    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.name.toLowerCase().includes(q) ||
          emp.email.toLowerCase().includes(q) ||
          emp.phone?.includes(q)
      );
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'isActive' && typeof value === 'boolean') {
          filtered = filtered.filter((emp) => emp.isActive === value);
        } else if (key === 'departmentId' && typeof value === 'number') {
          filtered = filtered.filter((emp) => emp.department?.id === value);
        } else if (key === 'position' && typeof value === 'string') {
          filtered = filtered.filter((emp) => emp.position === value);
        }
      }
    });

    filtered.sort((a, b) => a.id - b.id);
    setEmployees(filtered);
  }, [allEmployees, query, filters]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const openDeleteModal = (id: number) => setSelectedEmployeeToDelete(id);
  const closeDeleteModal = () => setSelectedEmployeeToDelete(null);

  const handleDeleteConfirmed = () => {
    if (selectedEmployeeToDelete !== null) {
      deleteEmployee(selectedEmployeeToDelete);
      closeDeleteModal();
    }
  };

  const toggleActiveStatus = (id: number) => {
    const emp = allEmployees.find((e) => e.id === id);
    if (!emp) return;

    const action = emp.isActive ? 'inativar' : 'ativar';
    if (!window.confirm(`Tem certeza que deseja ${action} o funcionário ${emp.name}?`)) return;

    updateEmployee(id, { ...emp, isActive: !emp.isActive });
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Lista de Funcionários</h1>

      <div className={styles.contentWrapper}>
        <aside className={styles.sidebar}>
          <EmployeeFilter onFilterChange={setFilters} />
        </aside>

        <section className={styles.rightSection}>
          <div className={styles.topBar}>
            <Link
              href="/employee/create"
              className={`${styles.btnPrimary} ${styles.btnRect}`}
              title="Novo Funcionário"
            >
            <FaPlus className={styles.iconSmall} />
              Novo Funcionário
            </Link>

            <div className={styles.searchGroup}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nome, e-mail ou telefone..."
                className={styles.searchInput}
                aria-label="Campo de busca de funcionários"
              />
              <FaSearch className={styles.searchIcon} />
            </div>
          </div>

          {employees.length === 0 ? (
            <p className={styles.noResults}>Nenhum funcionário encontrado.</p>
          ) : (
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  <th className={styles.th}>ID</th>
                  <th className={styles.th}>Nome</th>
                  <th className={styles.th}>Cargo</th>
                  <th className={styles.th}>Departamento</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} className={styles.trHover}>
                    <td className={styles.td}>{emp.id}</td>
                    <td className={styles.td}>{emp.name}</td>
                    <td className={styles.td}>{emp.position}</td>
                    <td className={styles.td}>{emp.department?.name || '-'}</td>
                    <td className={styles.td}>
                      {emp.isActive ? (
                        <span className={styles.statusActive}>Ativo</span>
                      ) : (
                        <span className={styles.statusInactive}>Inativo</span>
                      )}
                    </td>
                    <td className={`${styles.td} ${styles.actions}`}>
                      <Link
                        href={`/employee/${emp.id}`}
                        className={`${styles.btnIcon} ${styles.btnInfo}`}
                        title="Ver Detalhes"
                      >
                        <FaInfoCircle />
                      </Link>

                      <Link
                        href={`/employee/edit/${emp.id}`}
                        className={`${styles.btnIcon} ${styles.btnWarning}`}
                        title="Editar"
                      >
                        <FaEdit />
                      </Link>

                      <button
                        onClick={() => toggleActiveStatus(emp.id)}
                        className={`${styles.btnIcon} ${
                          emp.isActive ? styles.btnSecondary : styles.btnSuccess
                        }`}
                        title={emp.isActive ? 'Inativar' : 'Ativar'}
                      >
                        {emp.isActive ? <FaUserSlash /> : <FaUserCheck />}
                      </button>

                      <button
                        onClick={() => openDeleteModal(emp.id)}
                        className={`${styles.btnIcon} ${styles.btnDanger}`}
                        title="Excluir"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      {selectedEmployeeToDelete !== null && (
        <EmployeeDeleteModal
          employee={allEmployees.find((e) => e.id === selectedEmployeeToDelete)!}
          onClose={closeDeleteModal}
          onDeleted={handleDeleteConfirmed}
        />
      )}
    </main>
  );
}
