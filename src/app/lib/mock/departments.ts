// lib/mock/departments.ts

import { Department } from "../../types/department";

export const mockDepartments: Department[] = [
  { id: 1, name: "TI" },
  { id: 2, name: "RH" },
  { id: 3, name: "Marketing" },
];

export async function getMockDepartments(): Promise<Department[]> {
  return mockDepartments;
}
