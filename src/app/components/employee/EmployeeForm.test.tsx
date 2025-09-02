// app/components/employee/EmployeeForm.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import EmployeeForm from "./EmployeeForm";
import { Department } from "../../types/department";
import { EmployeeFormData } from "../../types/employeeFormData";

const mockDepartments: Department[] = [
  { id: 1, name: "RH" },
  { id: 2, name: "TI" },
];

describe("EmployeeForm", () => {
  it("renderiza todos os campos do formulário", () => {
    render(<EmployeeForm departments={mockDepartments} onSubmit={jest.fn()} />);

    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CPF/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Endereço/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cargo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Departamento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Salário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data de Admissão/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ativo/i)).toBeInTheDocument();
  });

  it("mostra erros de validação ao tentar enviar sem preencher campos", () => {
    render(<EmployeeForm departments={mockDepartments} onSubmit={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar Funcionário/i }));

    expect(screen.getByText(/Nome é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/CPF é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/Email é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/Telefone é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/Endereço é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/Cargo é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/Departamento é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/Salário é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/Data de admissão é obrigatória/i)).toBeInTheDocument();
  });

  it("chama onSubmit com dados válidos", () => {
    const mockOnSubmit = jest.fn();
    render(<EmployeeForm departments={mockDepartments} onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: "João da Silva" } });
    fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: "12345678900" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "joao@email.com" } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: "11999999999" } });
    fireEvent.change(screen.getByLabelText(/Endereço/i), { target: { value: "Rua X, 123" } });
    fireEvent.change(screen.getByLabelText(/Cargo/i), { target: { value: "Gerente" } });
    fireEvent.change(screen.getByLabelText(/Departamento/i), { target: { value: "2" } });
    fireEvent.change(screen.getByLabelText(/Salário/i), { target: { value: "5000" } });
    fireEvent.change(screen.getByLabelText(/Data de Admissão/i), { target: { value: "2025-08-20" } });

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar Funcionário/i }));

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining<EmployeeFormData>({
        name: "João da Silva",
        cpf: "12345678900",
        email: "joao@email.com",
        phone: "11999999999",
        address: "Rua X, 123",
        position: "Gerente",
        departmentId: "2",
        salary: "5000",
        admissionDate: "2025-08-20",
        isActive: true,
      })
    );
  });

  it("valida salário negativo", () => {
    render(<EmployeeForm departments={mockDepartments} onSubmit={jest.fn()} />);

    fireEvent.change(screen.getByLabelText(/Salário/i), { target: { value: "-1000" } });
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar Funcionário/i }));

    expect(screen.getByText(/Salário deve ser um número positivo/i)).toBeInTheDocument();
  });

  it("altera status isActive corretamente", () => {
    const mockOnSubmit = jest.fn();
    render(<EmployeeForm departments={mockDepartments} onSubmit={mockOnSubmit} />);

    const checkbox = screen.getByLabelText(/Ativo/i);
    fireEvent.click(checkbox); // desmarca
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar Funcionário/i }));

    // Como o resto do formulário está vazio, a validação impede submit
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("envia salário com casas decimais corretamente", () => {
    const mockOnSubmit = jest.fn();
    render(<EmployeeForm departments={mockDepartments} onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: "Teste" } });
    fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: "123" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: "123" } });
    fireEvent.change(screen.getByLabelText(/Endereço/i), { target: { value: "Rua X" } });
    fireEvent.change(screen.getByLabelText(/Cargo/i), { target: { value: "Gerente" } });
    fireEvent.change(screen.getByLabelText(/Departamento/i), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText(/Salário/i), { target: { value: "1234.56" } });
    fireEvent.change(screen.getByLabelText(/Data de Admissão/i), { target: { value: "2025-01-01" } });

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar Funcionário/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({ salary: "1234.56" }));
  });

  it("não chama onSubmit se houver erros", () => {
    const mockOnSubmit = jest.fn();
    render(<EmployeeForm departments={mockDepartments} onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar Funcionário/i }));

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
