// app/components/employee/EmployeeCreateForm.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EmployeeCreateForm from "./EmployeeCreateForm";
import { POSITIONS } from "@/app/types/position";
import type { Department } from "@/app/types/department";

describe("EmployeeCreateForm", () => {
  const mockDepartments: Department[] = [
    { id: 1, name: "RH" },
    { id: 2, name: "TI" },
  ];

  const setup = (onCreate = jest.fn()) =>
    render(<EmployeeCreateForm departments={mockDepartments} onCreate={onCreate} />);

  it("renderiza o formulário corretamente", () => {
    setup();
    expect(screen.getByRole("heading", { name: /Cadastrar Funcionário/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CPF/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cargo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Departamento/i)).toBeInTheDocument();
  });

  it("mostra erros de validação ao tentar salvar com campos obrigatórios vazios", async () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));

    expect(await screen.findByText(/Nome é obrigatório/i)).toBeInTheDocument();
    expect(await screen.findByText(/CPF é obrigatório/i)).toBeInTheDocument();
    expect(await screen.findByText(/Email é obrigatório/i)).toBeInTheDocument();
    expect(await screen.findByText(/Cargo é obrigatório/i)).toBeInTheDocument();
    expect(await screen.findByText(/Departamento é obrigatório/i)).toBeInTheDocument();
    expect(await screen.findByText(/Salário inválido/i)).toBeInTheDocument();
    expect(await screen.findByText(/Data de admissão é obrigatória/i)).toBeInTheDocument();
  });

  it("chama onCreate com os dados corretos quando o formulário é válido", async () => {
    const onCreateMock = jest.fn().mockResolvedValue(undefined);
    setup(onCreateMock);

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: "João Silva" } });
    fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: "12345678900" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "joao@email.com" } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: "11999999999" } });
    fireEvent.change(screen.getByLabelText(/Endereço/i), { target: { value: "Rua A" } });
    fireEvent.change(screen.getByLabelText(/Cargo/i), { target: { value: POSITIONS[0] } });
    fireEvent.change(screen.getByLabelText(/Departamento/i), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText(/Salário/i), { target: { value: "3500" } });
    fireEvent.change(screen.getByLabelText(/Data de Admissão/i), { target: { value: "2023-01-01" } });

    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));

    await waitFor(() => {
      expect(onCreateMock).toHaveBeenCalledTimes(1);
    });

    // Verifica se foi passado um FormData válido
    const formDataArg = onCreateMock.mock.calls[0][0] as FormData;
    expect(formDataArg.get("name")).toBe("João Silva");
    expect(formDataArg.get("cpf")).toBe("12345678900");
    expect(formDataArg.get("email")).toBe("joao@email.com");
    expect(formDataArg.get("position")).toBe(POSITIONS[0]);
    expect(formDataArg.get("departmentId")).toBe("1");
    expect(formDataArg.get("salary")).toBe("3500");
    expect(formDataArg.get("admissionDate")).toBe("2023-01-01");
  });
});
