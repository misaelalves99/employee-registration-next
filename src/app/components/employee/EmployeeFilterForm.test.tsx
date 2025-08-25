// app/employee/components/EmployeeFilterForm.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import EmployeeFilterForm from './EmployeeFilterForm';
import { Filters } from '../../types/employeeFilters';

describe('EmployeeFilterForm', () => {
  let filters: Filters;
  let setFilters: jest.Mock;

  beforeEach(() => {
    filters = {
      departmentId: '',
      position: '',
      isActive: '',
      admissionDateFrom: '',
      admissionDateTo: '',
    };
    setFilters = jest.fn();
  });

  it('deve renderizar todos os campos do formulário', () => {
    render(<EmployeeFilterForm filters={filters} setFilters={setFilters} />);

    expect(screen.getByLabelText(/Departamento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cargo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Admissão de/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Até/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Filtrar/i })).toBeInTheDocument();
  });

  it('deve chamar setFilters ao digitar no campo departmentId', () => {
    render(<EmployeeFilterForm filters={filters} setFilters={setFilters} />);

    const input = screen.getByLabelText(/Departamento/i);
    fireEvent.change(input, { target: { value: '10' } });

    expect(setFilters).toHaveBeenCalled();
    expect(setFilters).toHaveBeenCalledWith(expect.any(Function));

    // Simula o retorno esperado do callback
    const updater = setFilters.mock.calls[0][0];
    const updatedFilters = updater(filters);
    expect(updatedFilters.departmentId).toBe('10');
  });

  it('deve chamar setFilters ao selecionar um cargo', () => {
    render(<EmployeeFilterForm filters={filters} setFilters={setFilters} />);

    const select = screen.getByLabelText(/Cargo/i);
    fireEvent.change(select, { target: { value: 'Gerente' } });

    const updater = setFilters.mock.calls[0][0];
    const updatedFilters = updater(filters);
    expect(updatedFilters.position).toBe('Gerente');
  });

  it('deve chamar setFilters ao alterar status', () => {
    render(<EmployeeFilterForm filters={filters} setFilters={setFilters} />);

    const select = screen.getByLabelText(/Status/i);
    fireEvent.change(select, { target: { value: 'true' } });

    const updater = setFilters.mock.calls[0][0];
    const updatedFilters = updater(filters);
    expect(updatedFilters.isActive).toBe('true');
  });

  it('deve chamar setFilters ao alterar datas', () => {
    render(<EmployeeFilterForm filters={filters} setFilters={setFilters} />);

    const fromInput = screen.getByLabelText(/Admissão de/i);
    const toInput = screen.getByLabelText(/Até/i);

    fireEvent.change(fromInput, { target: { value: '2024-01-01' } });
    fireEvent.change(toInput, { target: { value: '2024-12-31' } });

    const updater1 = setFilters.mock.calls[0][0];
    const updatedFilters1 = updater1(filters);
    expect(updatedFilters1.admissionDateFrom).toBe('2024-01-01');

    const updater2 = setFilters.mock.calls[1][0];
    const updatedFilters2 = updater2(filters);
    expect(updatedFilters2.admissionDateTo).toBe('2024-12-31');
  });
});
