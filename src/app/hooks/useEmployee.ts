// src/hooks/useEmployee.ts
'use client';

import { useContext } from 'react';
import { EmployeeContext, EmployeeContextType } from '../contexts/EmployeeContext';

export function useEmployee(): EmployeeContextType {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployee deve ser usado dentro do EmployeeProvider');
  }
  return context;
}
