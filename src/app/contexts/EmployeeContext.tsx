// src/contexts/EmployeeContext.tsx
'use client';

import { createContext } from 'react';
import { Employee } from '../types/employee';

export interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: number, data: Partial<Employee>) => void;
  deleteEmployee: (id: number) => void;
  toggleActiveStatus: (id: number) => void;
}

export const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);
