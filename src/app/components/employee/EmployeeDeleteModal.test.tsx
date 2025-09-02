// app/components/employee/EmployeeDeleteModal.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EmployeeDeleteModal from "./EmployeeDeleteModal";
import type { Employee } from "../../types/employee";

describe("EmployeeDeleteModal", () => {
  const mockEmployee: Employee = {
    id: 1,
    name: "Maria Silva",
    cpf: "12345678900",
    email: "maria@email.com",
    phone: "11999999999",
    address: "Rua X",
    position: "Gerente",
    department: { id: 10, name: "RH" },
    salary: 5000,
    admissionDate: "2023-01-01",
    isActive: true,
  };

  const setup = (employee: Employee | null, onClose = jest.fn(), onDeleted = jest.fn()) =>
    render(<EmployeeDeleteModal employee={employee} onClose={onClose} onDeleted={onDeleted} />);

  it("não renderiza nada quando employee é null", () => {
    const { container } = setup(null);
    expect(container.firstChild).toBeNull();
  });

  it("renderiza corretamente os detalhes do funcionário", () => {
    setup(mockEmployee);
    expect(screen.getByText(/Confirmar Exclusão/i)).toBeInTheDocument();
    expect(screen.getByText(/Maria Silva/)).toBeInTheDocument();
    expect(screen.getByText(/12345678900/)).toBeInTheDocument();
    expect(screen.getByText(/Gerente/)).toBeInTheDocument();
    expect(screen.getByText(/RH/)).toBeInTheDocument();
  });

  it("chama onClose ao clicar no botão cancelar", () => {
    const onCloseMock = jest.fn();
    setup(mockEmployee, onCloseMock);

    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("desabilita o botão durante exclusão e chama onDeleted e onClose ao confirmar", async () => {
    const onCloseMock = jest.fn();
    const onDeletedMock = jest.fn();
    setup(mockEmployee, onCloseMock, onDeletedMock);

    const confirmButton = screen.getByRole("button", { name: /Confirmar Exclusão/i });
    fireEvent.click(confirmButton);

    // Botão deve ficar desabilitado durante o loading
    expect(confirmButton).toBeDisabled();
    expect(await screen.findByText(/Deletando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(onDeletedMock).toHaveBeenCalledTimes(1);
      expect(onCloseMock).toHaveBeenCalledTimes(1);
      expect(confirmButton).not.toBeDisabled();
    });
  });

  it("chama onClose ao clicar fora do modal (backdrop)", () => {
    const onCloseMock = jest.fn();
    setup(mockEmployee, onCloseMock);

    const backdrop = screen.getByText(/Confirmar Exclusão/i).closest("div")!.parentElement!;
    fireEvent.click(backdrop);
    expect(onCloseMock).toHaveBeenCalled();
  });
});
