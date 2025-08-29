// app/employee/create/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Department } from '../../types/department'
import { Position } from '../../types/position'
import { createMockEmployee } from '../../lib/mock/employees'
import { getMockDepartments } from '../../lib/mock/departments'
import { getMockPositions } from '../../lib/mock/positions'
import styles from './CreateEmployeeForm.module.css'

export default function CreateEmployeePage() {
  const router = useRouter()
  const [departments, setDepartments] = useState<Department[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    address: '',
    salary: '',
    admissionDate: '',
    departmentId: '',
    position: '' as Position,
    isActive: true,
  })

  useEffect(() => {
    async function fetchData() {
      const [deps, pos] = await Promise.all([
        getMockDepartments(),
        getMockPositions(),
      ])
      setDepartments(deps)
      setPositions(pos)
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setFormData(prev => ({ ...prev, [name]: newValue }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createMockEmployee({
      id: Date.now(),
      name: formData.name,
      cpf: formData.cpf,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      salary: parseFloat(formData.salary),
      admissionDate: formData.admissionDate || new Date().toISOString(),
      position: formData.position,
      departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
      department: departments.find(d => d.id === parseInt(formData.departmentId)),
      isActive: formData.isActive,
    })
    router.push('/employee')
  }

  if (loading) return <p className={styles.loading}>Carregando...</p>

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Criar Funcionário</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {[
          ['name', 'Nome'],
          ['cpf', 'CPF'],
          ['email', 'Email'],
          ['phone', 'Telefone'],
          ['address', 'Endereço'],
        ].map(([key, label]) => (
          <div className={styles.field} key={key}>
            <label htmlFor={key} className={styles.label}>{label}:</label>
            <input
              type="text"
              id={key}
              name={key}
              value={formData[key as keyof typeof formData] as string}
              onChange={handleChange}
              required={key !== 'phone' && key !== 'address'}
              className={styles.input}
            />
          </div>
        ))}

        <div className={styles.field}>
          <label htmlFor="salary" className={styles.label}>Salário:</label>
          <input
            type="number"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            required
            step="0.01"
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="admissionDate" className={styles.label}>Data de Admissão:</label>
          <input
            type="date"
            id="admissionDate"
            name="admissionDate"
            value={formData.admissionDate}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="departmentId" className={styles.label}>Departamento:</label>
          <select
            id="departmentId"
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">Selecione...</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="position" className={styles.label}>Cargo:</label>
          <select
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            className={styles.select}
          >
            <option value="">Selecione...</option>
            {positions.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className={styles.checkboxInput}
          />
          <label htmlFor="isActive" className={styles.label}>Ativo</label>
        </div>

        <button
          type="submit"
          className={styles.button}
        >
          Criar Funcionário
        </button>
        <button
          type="button"
          onClick={() => router.push('/employee')}
          className={`${styles.button} ${styles.backButton}`}
        >
          Voltar
        </button>
      </form>
    </div>
  )
}
