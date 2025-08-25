// types/employee.ts

import { Department } from './department';
import { Position } from './position';

export interface Employee {
  id: number;
  name: string;
  cpf: string;
  email: string;
  phone?: string;
  address?: string;
  position: Position;
  department?: Department;
  departmentId?: number | null;
  salary: number;
  admissionDate: string;
  isActive: boolean;
  departmentName?: string;
  hiredDate?: string;
  active?: boolean;
}
