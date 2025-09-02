// app/employee/components/EmployeeList.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import EmployeeList from "./EmployeeList";
import type { Employee } from "../../types/employee";

const mockEmployees: Employee[] = [
  {
    id: 1,
    name: "João Silva",
    cpf: "123.456.789-00",
    email: "joao@example.com",
    phone: "11999999999",
    position: "Desenvolvedor",
    department: { id: 10, name: "TI" },
    salary: 5000,
    admissionDate: "2023-01-01",
    isActive: true,
  },
  {
    id: 2,
    name: "Maria Souza",
    cpf: "987.654.321-00",
    email: "maria@example.com",
    phone: "21988888888",
    position: "Analista",
    department: { id: 10, name: "TI" },
    salary: 4000,
    admissionDate: "2022-06-15",
    isActive: false,
  },
];

describe("EmployeeList", () => {
  it("deve renderizar cabeçalhos da tabela", () => {
    render(<EmployeeList employees={mockEmployees} onDelete={jest.fn()} />);

    ["Nome","CPF","Email","Telefone","Cargo","Departamento","Salário","Admissão","Status","Ações"].forEach(text => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it("deve renderizar os funcionários corretamente", () => {
    render(<EmployeeList employees={mockEmployees} onDelete={jest.fn()} />);

    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Maria Souza")).toBeInTheDocument();

    // Departamento nulo deve exibir "—"
    expect(screen.getByText("—")).toBeInTheDocument();

    // Status
    expect(screen.getByText("Ativo")).toBeInTheDocument();
    expect(screen.getByText("Inativo")).toBeInTheDocument();

    // Salário formatado
    expect(screen.getByText("R$ 5.000,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 4.000,00")).toBeInTheDocument();

    // Data de admissão formatada
    expect(screen.getByText("01/01/2023")).toBeInTheDocument();
    expect(screen.getByText("15/06/2022")).toBeInTheDocument();
  });

  it("deve renderizar botão de inativar para funcionário ativo e ativar para inativo", () => {
    render(<EmployeeList employees={mockEmployees} onDelete={jest.fn()} />);

    expect(screen.getByTitle("Inativar")).toBeInTheDocument();
    expect(screen.getByTitle("Ativar")).toBeInTheDocument();
  });

  it("deve chamar onDelete ao clicar em Deletar", () => {
    const handleDelete = jest.fn();
    render(<EmployeeList employees={mockEmployees} onDelete={handleDelete} />);

    const deleteButtons = screen.getAllByTitle("Deletar");
    fireEvent.click(deleteButtons[0]);

    expect(handleDelete).toHaveBeenCalledTimes(1);
    expect(handleDelete).toHaveBeenCalledWith(mockEmployees[0]);
  });

  it("deve renderizar links de detalhes e edição corretos", () => {
    render(<EmployeeList employees={mockEmployees} onDelete={jest.fn()} />);

    expect(screen.getByText("Detalhes")).toHaveAttribute("href", `/employee/details/1`);
    expect(screen.getByText("Editar")).toHaveAttribute("href", `/employee/edit/1`);
  });
});
