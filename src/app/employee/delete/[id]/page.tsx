// app/employee/delete/[id]/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Employee } from '../../../types/employee'
import { getMockEmployees, deleteMockEmployee } from '../../../lib/mock/mockData'
import styles from './EmployeeDeletePage.module.css'

interface EmployeeDeletePageProps {
  params: { id: string }
}

export default function EmployeeDeletePage({ params }: EmployeeDeletePageProps) {
  const router = useRouter()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const employees = getMockEmployees()
    const found = employees.find(emp => emp.id === Number(params.id))
    if (!found) {
      setError('Funcionário não encontrado.')
    } else {
      setEmployee(found)
    }
    setLoading(false)
  }, [params.id])

  const handleDelete = () => {
    const confirmDelete = confirm(`Tem certeza que deseja deletar o funcionário ${employee?.name}?`)
    if (!confirmDelete) return

    try {
      deleteMockEmployee(Number(params.id))
      router.push('/employee')
    } catch (err) {
      console.error(err)
      setError('Erro ao deletar funcionário.')
    }
  }

  if (loading) return <p className={styles.loading}>Carregando funcionário...</p>
  if (error) return <p className={styles.error}>{error}</p>
  if (!employee) return <p className={styles.error}>Funcionário não encontrado.</p>

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Deletar Funcionário</h1>
      <p className={styles.message}>
        Tem certeza que deseja deletar o funcionário <strong>{employee.name}</strong>?
      </p>

      <div className={styles.detailsBox}>
        <p><strong>CPF:</strong> {employee.cpf}</p>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Cargo:</strong> {employee.position}</p>
        <p><strong>Departamento:</strong> {employee.department?.name ?? 'Não informado'}</p>
      </div>

      <div className={styles.buttons}>
        <button
          onClick={handleDelete}
          className={styles.btnDelete}
        >
          Deletar
        </button>
        <button
          onClick={() => router.push('/employee')}
          className={styles.btnCancel}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
