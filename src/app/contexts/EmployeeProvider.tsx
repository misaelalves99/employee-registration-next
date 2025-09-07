// src/contexts/EmployeeProvider.tsx
'use client';

import React, { useState, useCallback, ReactNode } from 'react';
import { EmployeeContext } from './EmployeeContext';
import { Employee } from '../types/employee';
import { mockEmployees, createMockEmployee, updateMockEmployee } from '../lib/mock/employees';

interface Props {
  children: ReactNode;
}

export const EmployeeProvider: React.FC<Props> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([...mockEmployees]);

  const addEmployee = useCallback((employee: Employee) => {
    createMockEmployee(employee);
    setEmployees([...mockEmployees]);
  }, []);

  const updateEmployee = useCallback((id: number, data: Partial<Employee>) => {
    updateMockEmployee(id, data);
    setEmployees([...mockEmployees]);
  }, []);

  const deleteEmployee = useCallback((id: number) => {
    const index = mockEmployees.findIndex(e => e.id === id);
    if (index !== -1) {
      mockEmployees.splice(index, 1);
      setEmployees([...mockEmployees]);
    }
  }, []);

  const toggleActiveStatus = useCallback((id: number) => {
    const emp = mockEmployees.find(e => e.id === id);
    if (!emp) return;
    updateMockEmployee(id, { isActive: !emp.isActive });
    setEmployees([...mockEmployees]);
  }, []);

  return (
    <EmployeeContext.Provider
      value={{ employees, addEmployee, updateEmployee, deleteEmployee, toggleActiveStatus }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
