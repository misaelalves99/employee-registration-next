// app/components/employee/EmployeeForm.tsx

'use client';

import { useState, useCallback, useMemo } from 'react';
import { Department } from '../../types/department';
import { EmployeeFormData } from '../../types/employeeFormData';
import { POSITIONS, Position } from '../../types/position';
import styles from './EmployeeForm.module.css';

interface EmployeeFormProps {
  departments: Department[];
  onSubmit: (formData: EmployeeFormData) => void;
}

export default function EmployeeForm({ departments, onSubmit }: EmployeeFormProps) {
  const initialFormData: EmployeeFormData = {
    name: '',
    cpf: '',
    email: '',
    phone: '',
    address: '',
    position: '' as Position,
    departmentId: '',
    salary: '',
    admissionDate: '',
    isActive: true,
  };

  const [formData, setFormData] = useState<EmployeeFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({});

  const validate = useCallback(() => {
    const newErrors: Partial<Record<keyof EmployeeFormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório.';
    if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório.';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório.';
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório.';
    if (!formData.address.trim()) newErrors.address = 'Endereço é obrigatório.';
    if (!formData.position) newErrors.position = 'Cargo é obrigatório.';
    if (!formData.departmentId) newErrors.departmentId = 'Departamento é obrigatório.';
    if (formData.salary === '') {
      newErrors.salary = 'Salário é obrigatório.';
    } else if (isNaN(Number(formData.salary)) || Number(formData.salary) < 0) {
      newErrors.salary = 'Salário deve ser um número positivo.';
    }
    if (!formData.admissionDate) newErrors.admissionDate = 'Data de admissão é obrigatória.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'position' ? (value as Position) : value,
    }));
  };

  const handleCheckboxChange = () => {
    setFormData((prev) => ({
      ...prev,
      isActive: !prev.isActive,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        salary: formData.salary.trim(),
      });
    }
  };

  const departmentOptions = useMemo(
    () =>
      departments.map((dept) => (
        <option key={dept.id} value={dept.id}>
          {dept.name}
        </option>
      )),
    [departments]
  );

  const positionOptions = useMemo(
    () =>
      POSITIONS.map((pos) => (
        <option key={pos} value={pos}>
          {pos}
        </option>
      )),
    []
  );

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Nome */}
      <div>
        <label className={styles.label}>Nome</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={styles.input}
        />
        {errors.name && <p className={styles.errorText}>{errors.name}</p>}
      </div>

      {/* CPF */}
      <div>
        <label className={styles.label}>CPF</label>
        <input
          type="text"
          name="cpf"
          value={formData.cpf}
          onChange={handleChange}
          className={styles.input}
        />
        {errors.cpf && <p className={styles.errorText}>{errors.cpf}</p>}
      </div>

      {/* Email */}
      <div>
        <label className={styles.label}>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={styles.input}
        />
        {errors.email && <p className={styles.errorText}>{errors.email}</p>}
      </div>

      {/* Telefone */}
      <div>
        <label className={styles.label}>Telefone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={styles.input}
        />
        {errors.phone && <p className={styles.errorText}>{errors.phone}</p>}
      </div>

      {/* Endereço */}
      <div>
        <label className={styles.label}>Endereço</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={styles.input}
        />
        {errors.address && <p className={styles.errorText}>{errors.address}</p>}
      </div>

      {/* Cargo */}
      <div>
        <label className={styles.label}>Cargo</label>
        <select
          name="position"
          value={formData.position}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="">Selecione</option>
          {positionOptions}
        </select>
        {errors.position && <p className={styles.errorText}>{errors.position}</p>}
      </div>

      {/* Departamento */}
      <div>
        <label className={styles.label}>Departamento</label>
        <select
          name="departmentId"
          value={formData.departmentId}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="">Selecione</option>
          {departmentOptions}
        </select>
        {errors.departmentId && <p className={styles.errorText}>{errors.departmentId}</p>}
      </div>

      {/* Salário */}
      <div>
        <label className={styles.label}>Salário</label>
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          className={styles.input}
          step="0.01"
        />
        {errors.salary && <p className={styles.errorText}>{errors.salary}</p>}
      </div>

      {/* Data de Admissão */}
      <div>
        <label className={styles.label}>Data de Admissão</label>
        <input
          type="date"
          name="admissionDate"
          value={formData.admissionDate}
          onChange={handleChange}
          className={styles.input}
        />
        {errors.admissionDate && (
          <p className={styles.errorText}>{errors.admissionDate}</p>
        )}
      </div>

      {/* Status Ativo */}
      <div className={styles.checkboxContainer}>
        <input
          type="checkbox"
          checked={formData.isActive}
          onChange={handleCheckboxChange}
          className={styles.formCheckbox}
          id="isActive"
        />
        <label htmlFor="isActive">Ativo</label>
      </div>

      {/* Botão de envio */}
      <button type="submit" className={styles.submitButton}>
        Cadastrar Funcionário
      </button>
    </form>
  );
}
