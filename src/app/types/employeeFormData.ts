// types/EmployeeFormData.ts

import { PositionFormValue } from "./position";

export interface EmployeeFormData {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  address: string;
  position: PositionFormValue;
  departmentId: string;
  salary: string;
  admissionDate: string;
  isActive: boolean;
}
