export interface EmployeeReactivatePageProps {
  params: { id: string };
}

export interface Employee {
  id: number;
  name: string;
  cpf: string;
  email: string;
  position: string;
  departmentName?: string | null;
}
