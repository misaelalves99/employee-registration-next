// app/employee/components/EmployeeList.tsx

'use client';

import { Employee } from '../../types/employee';
import styles from './EmployeeList.module.css';

interface EmployeeListProps {
  employees: Employee[];
  onDelete: (employee: Employee) => void;
}

export default function EmployeeList({ employees, onDelete }: EmployeeListProps) {
  return (
    <table className={styles.table}>
      <thead className={styles.thead}>
        <tr>
          <th className={styles.th}>Nome</th>
          <th className={styles.th}>CPF</th>
          <th className={styles.th}>Email</th>
          <th className={styles.th}>Telefone</th>
          <th className={styles.th}>Cargo</th>
          <th className={styles.th}>Departamento</th>
          <th className={styles.th}>Salário</th>
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
            <td className={styles.td}>{emp.email}</td>
            <td className={styles.td}>{emp.phone}</td>
            <td className={styles.td}>{emp.position}</td>
            <td className={styles.td}>{emp.department?.name ?? '—'}</td>
            <td className={styles.td}>
              {emp.salary.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </td>
            <td className={styles.td}>
              {new Date(emp.admissionDate).toLocaleDateString('pt-BR')}
            </td>
            <td className={styles.td}>{emp.isActive ? 'Ativo' : 'Inativo'}</td>
            <td className={`${styles.td} ${styles.actions}`}>
              <a href={`/employee/details/${emp.id}`} className={`${styles.btn} ${styles.btnInfo}`}>
                Detalhes
              </a>
              <a href={`/employee/edit/${emp.id}`} className={`${styles.btn} ${styles.btnWarning}`}>
                Editar
              </a>

              {emp.isActive ? (
                <form
                  action={`/api/employee/inactivate/${emp.id}`}
                  method="POST"
                  className="inline"
                >
                  <button
                    type="submit"
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    title="Inativar"
                  >
                    Inativar
                  </button>
                </form>
              ) : (
                <form
                  action={`/api/employee/reactivate/${emp.id}`}
                  method="POST"
                  className="inline"
                >
                  <button
                    type="submit"
                    className={`${styles.btn} ${styles.btnSuccess}`}
                    title="Ativar"
                  >
                    Ativar
                  </button>
                </form>
              )}

              <button
                onClick={() => onDelete(emp)}
                className={`${styles.btn} ${styles.btnDanger}`}
                title="Deletar"
              >
                Deletar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
