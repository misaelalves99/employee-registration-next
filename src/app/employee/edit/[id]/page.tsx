// app/employee/edit/[id]/page.tsx

'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EmployeeForm } from '../../../types/employeeForm';
import { Department } from '../../../types/department';
import { POSITIONS } from '../../../types/position';
import { getEmployeeById, updateMockEmployee } from '../../../lib/mock/employees';
import { getMockDepartments } from '../../../lib/mock/departments';
import styles from './EditEmployeePage.module.css';

interface EditEmployeePageProps {
  params: { id: string };
}

export default function EditEmployeePage({ params }: EditEmployeePageProps) {
  const router = useRouter();
  const [employee, setEmployee] = useState<EmployeeForm | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const id = Number(params.id);
    const data = getEmployeeById(id);

    if (!data) {
      setErrors(['Funcionário não encontrado']);
      setLoading(false);
      return;
    }

    setEmployee({
      id: data.id,
      name: data.name,
      cpf: data.cpf,
      email: data.email,
      phone: data.phone || '',
      address: data.address || '',
      position: data.position,
      departmentId: data.department?.id ?? null,
      salary: data.salary,
      admissionDate: data.admissionDate.slice(0, 10),
      isActive: data.isActive,
    });

    getMockDepartments().then(setDepartments);
    setLoading(false);
  }, [params.id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!employee) return;

    const updated = updateMockEmployee(employee.id, employee);

    if (updated) {
      router.push('/employee');
    } else {
      setErrors(['Erro ao salvar dados do funcionário.']);
    }
  }

  if (loading) return <p>Carregando...</p>;
  if (!employee) return <p>Funcionário não encontrado</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Editar Funcionário</h1>

      {errors.length > 0 && (
        <div className={styles.errorContainer}>
          {errors.map((err, i) => (
            <p key={i} className={styles.errorText}>{err}</p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {[['name', 'Nome'], ['cpf', 'CPF'], ['email', 'Email'], ['phone', 'Telefone'], ['address', 'Endereço']].map(
          ([key, label]) => (
            <div className={styles.field} key={key}>
              <label className={styles.label}>{label}</label>
              <input
                type="text"
                className={styles.input}
                value={employee[key as keyof EmployeeForm] as string}
                onChange={(e) => setEmployee({ ...employee, [key]: e.target.value })}
                required={key !== 'phone' && key !== 'address'}
              />
            </div>
          )
        )}

        <div className={styles.field}>
          <label className={styles.label}>Cargo</label>
          <select
            className={styles.input}
            value={employee.position}
            onChange={(e) =>
              setEmployee({ ...employee, position: e.target.value as typeof POSITIONS[number] })
            }
            required
          >
            {POSITIONS.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Departamento</label>
          <select
            className={styles.input}
            value={employee.departmentId ?? ''}
            onChange={(e) =>
              setEmployee({
                ...employee,
                departmentId: e.target.value ? Number(e.target.value) : null,
              })
            }
          >
            <option value="">Nenhum</option>
            {departments.map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Salário</label>
          <input
            type="number"
            step="0.01"
            className={styles.input}
            value={employee.salary}
            onChange={(e) => setEmployee({ ...employee, salary: parseFloat(e.target.value) })}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Data de Admissão</label>
          <input
            type="date"
            className={styles.input}
            value={employee.admissionDate}
            onChange={(e) => setEmployee({ ...employee, admissionDate: e.target.value })}
            required
          />
        </div>

        <div className={styles.checkboxContainer}>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={employee.isActive}
              onChange={(e) => setEmployee({ ...employee, isActive: e.target.checked })}
            />
            Ativo
          </label>
        </div>

        <div className={styles.buttons}>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            Salvar
          </button>
          <Link href="/employee" className={`${styles.btn} ${styles.btnSecondary}`}>
            Voltar
          </Link>
        </div>
      </form>
    </div>
  );
}
