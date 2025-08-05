// types/EmployeeForm.ts

import { Position } from './position';

export interface EmployeeForm {
  id: number;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  address: string;
  position: Position; // <-- aqui estava como string
  departmentId: number | null;
  salary: number;
  admissionDate: string;
  isActive: boolean;
}
