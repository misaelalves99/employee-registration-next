// types/EmployeeFormData.ts

import { PositionFormValue } from "./position";

export interface EmployeeFormData {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  address: string;
  position: PositionFormValue;  // aceita '' + posições válidas
  departmentId: string;         // mantido como string (como no form)
  salary: string;               // mantido como string (como no form)
  admissionDate: string;
  isActive: boolean;
}
