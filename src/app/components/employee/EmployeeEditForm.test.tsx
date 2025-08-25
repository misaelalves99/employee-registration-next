// app/components/employee/EmployeeEditForm.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EmployeeEditForm from "./EmployeeEditForm";
import { POSITIONS } from "@/app/types/position";
import type { Department } from "@/app/types/department";

describe("EmployeeEditForm", () => {
  const mockEmployee = {
    id: 1,
    name: "João Silva",
    cpf: "12345678900",
    email: "joao@email.com",
    phone: "11999999999",
    address: "Rua A",
    position: POSITIONS[0],
    departmentId: 2,
    salary: 3500,
    admissionDate: "2023-01-01",
  };

  const mockDepartments: Department[] = [
    { id: 1, name: "RH" },
    { id: 2, name: "TI" },
  ];

  const setup = (onUpdate = jest.fn()) =>
    render(<EmployeeEditForm employee={mockEmployee} departments={mockDepartments} onUpdate={onUpdate} />);

  it("renderiza com os valores iniciais do funcionário", () => {
    setup();

    expect(screen.getByDisplayValue("João Silva")).toBeInTheDocument();
    expect(screen.getByDisplayValue("12345678900")).toBeInTheDocument();
    expect(screen.getByDisplayValue("joao@email.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("11999999999")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Rua A")).toBeInTheDocument();
    expect(screen.getByDisplayValue(POSITIONS[0])).toBeInTheDocument();
    expect(screen.getByDisplayValue("2")).toBeInTheDocument();
    expect(screen.getByDisplayValue("3500")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2023-01-01")).toBeInTheDocument();
  });

  it("mostra erros de validação ao tentar salvar com campos obrigatórios vazios", async () => {
    setup();

    // Limpa valores obrigatórios
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/Cargo/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/Departamento/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/Salário/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/Data de Admissão/i), { target: { value: "" } });

    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));

    expect(await screen.findByText(/Nome é obrigatório/i)).toBeInTheDocument();
    expect(await screen.findByText(/CPF é obrigatório/i)).toBeInTheDocument();
    expect(await screen.findByText(/Email é obrigatório/i)).toBeInTheDocument();
    expect(await screen.findByText(/Cargo é obrigatório/i)).toBeInTheDocument();
    expect(await screen.findByText(/Departamento é obrigatório/i)).toBeInTheDocument();
    expect(await screen.findByText(/Salário inválido/i)).toBeInTheDocument();
    expect(await screen.findByText(/Data de admissão é obrigatória/i)).toBeInTheDocument();
  });

  it("chama onUpdate com os dados corretos quando o formulário é válido", async () => {
    const onUpdateMock = jest.fn().mockResolvedValue(undefined);
    setup(onUpdateMock);

    // Altera alguns campos
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: "Maria Souza" } });
    fireEvent.change(screen.getByLabelText(/Salário/i), { target: { value: "4000" } });

    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));

    await waitFor(() => {
      expect(onUpdateMock).toHaveBeenCalledTimes(1);
    });

    const formDataArg = onUpdateMock.mock.calls[0][0] as FormData;
    expect(formDataArg.get("name")).toBe("Maria Souza");
    expect(formDataArg.get("cpf")).toBe("12345678900"); // manteve o valor original
    expect(formDataArg.get("salary")).toBe("4000"); // atualizado
  });
});
