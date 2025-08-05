// app/components/employee/EmployeeCreateForm.tsx

'use client';

import { useState, FormEvent } from 'react';
import { Position, POSITIONS } from '@/app/types/position';
import { Department } from '@/app/types/department';
import styles from './EmployeeCreateForm.module.css';

interface EmployeeCreateFormProps {
  departments: Department[];
  onCreate: (data: FormData) => Promise<void>;
}

export default function EmployeeCreateForm({ departments, onCreate }: EmployeeCreateFormProps) {
  const [form, setForm] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    address: '',
    position: '' as Position | '',
    departmentId: '',
    salary: '',
    admissionDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!form.name) newErrors.name = 'Nome é obrigatório.';
    if (!form.cpf) newErrors.cpf = 'CPF é obrigatório.';
    if (!form.email) newErrors.email = 'Email é obrigatório.';
    if (!form.position) newErrors.position = 'Cargo é obrigatório.';
    if (!form.departmentId) newErrors.departmentId = 'Departamento é obrigatório.';
    if (!form.salary || isNaN(Number(form.salary))) newErrors.salary = 'Salário inválido.';
    if (!form.admissionDate) newErrors.admissionDate = 'Data de admissão é obrigatória.';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    await onCreate(formData);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h1 className={styles.title}>Cadastrar Funcionário</h1>

      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>Nome</label>
        <input id="name" name="name" type="text" className={styles.input} value={form.name} onChange={handleChange} />
        {errors.name && <small className={styles.errorText}>{errors.name}</small>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="cpf" className={styles.label}>CPF</label>
        <input id="cpf" name="cpf" type="text" className={styles.input} value={form.cpf} onChange={handleChange} />
        {errors.cpf && <small className={styles.errorText}>{errors.cpf}</small>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input id="email" name="email" type="email" className={styles.input} value={form.email} onChange={handleChange} />
        {errors.email && <small className={styles.errorText}>{errors.email}</small>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="phone" className={styles.label}>Telefone</label>
        <input id="phone" name="phone" type="text" className={styles.input} value={form.phone} onChange={handleChange} />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="address" className={styles.label}>Endereço</label>
        <input id="address" name="address" type="text" className={styles.input} value={form.address} onChange={handleChange} />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="position" className={styles.label}>Cargo</label>
        <select id="position" name="position" className={styles.select} value={form.position} onChange={handleChange}>
          <option value="">Selecione</option>
          {POSITIONS.map((pos) => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>
        {errors.position && <small className={styles.errorText}>{errors.position}</small>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="departmentId" className={styles.label}>Departamento</label>
        <select id="departmentId" name="departmentId" className={styles.select} value={form.departmentId} onChange={handleChange}>
          <option value="">Selecione</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        {errors.departmentId && <small className={styles.errorText}>{errors.departmentId}</small>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="salary" className={styles.label}>Salário</label>
        <input id="salary" name="salary" type="number" step="0.01" className={styles.input} value={form.salary} onChange={handleChange} />
        {errors.salary && <small className={styles.errorText}>{errors.salary}</small>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="admissionDate" className={styles.label}>Data de Admissão</label>
        <input id="admissionDate" name="admissionDate" type="date" className={styles.input} value={form.admissionDate} onChange={handleChange} />
        {errors.admissionDate && <small className={styles.errorText}>{errors.admissionDate}</small>}
      </div>

      <button type="submit" className={styles.button}>Salvar</button>
    </form>
  );
}
