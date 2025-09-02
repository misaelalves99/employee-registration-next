// app/employee/components/EmployeeFilterForm.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import EmployeeFilterForm from './EmployeeFilterForm';
import { Filters } from '../../types/employeeFilters';
import { POSITIONS } from '../../types/position';

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

  it('renderiza todos os campos do formulário', () => {
    render(<EmployeeFilterForm filters={filters} setFilters={setFilters} />);

    expect(screen.getByLabelText(/Departamento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cargo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Admissão de/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Até/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Filtrar/i })).toBeInTheDocument();
  });

  it('chama setFilters ao digitar no campo departmentId', () => {
    render(<EmployeeFilterForm filters={filters} setFilters={setFilters} />);
    const input = screen.getByLabelText(/Departamento/i);

    fireEvent.change(input, { target: { value: '10' } });

    expect(setFilters).toHaveBeenCalled();
    const updater = setFilters.mock.calls[0][0];
    const updatedFilters = updater(filters);
    expect(updatedFilters.departmentId).toBe('10');
  });

  it('chama setFilters ao selecionar um cargo', () => {
    render(<EmployeeFilterForm filters={filters} setFilters={setFilters} />);
    const select = screen.getByLabelText(/Cargo/i);

    fireEvent.change(select, { target: { value: POSITIONS[0] } });

    const updater = setFilters.mock.calls[0][0];
    const updatedFilters = updater(filters);
    expect(updatedFilters.position).toBe(POSITIONS[0]);
  });

  it('chama setFilters ao alterar status', () => {
    render(<EmployeeFilterForm filters={filters} setFilters={setFilters} />);
    const select = screen.getByLabelText(/Status/i);

    fireEvent.change(select, { target: { value: 'true' } });

    const updater = setFilters.mock.calls[0][0];
    const updatedFilters = updater(filters);
    expect(updatedFilters.isActive).toBe('true');
  });

  it('chama setFilters ao alterar datas', () => {
    render(<EmployeeFilterForm filters={filters} setFilters={setFilters} />);
    const fromInput = screen.getByLabelText(/Admissão de/i);
    const toInput = screen.getByLabelText(/Até/i);

    fireEvent.change(fromInput, { target: { value: '2024-01-01' } });
    fireEvent.change(toInput, { target: { value: '2024-12-31' } });

    const updaterFrom = setFilters.mock.calls[0][0];
    const updatedFrom = updaterFrom(filters);
    expect(updatedFrom.admissionDateFrom).toBe('2024-01-01');

    const updaterTo = setFilters.mock.calls[1][0];
    const updatedTo = updaterTo(filters);
    expect(updatedTo.admissionDateTo).toBe('2024-12-31');
  });

  it('permite limpar campos selecionando valores vazios', () => {
    render(<EmployeeFilterForm filters={filters} setFilters={setFilters} />);
    const positionSelect = screen.getByLabelText(/Cargo/i);
    const statusSelect = screen.getByLabelText(/Status/i);

    fireEvent.change(positionSelect, { target: { value: '' } });
    fireEvent.change(statusSelect, { target: { value: '' } });

    const updaterPos = setFilters.mock.calls[0][0];
    const updatedPos = updaterPos(filters);
    expect(updatedPos.position).toBe('');

    const updaterStatus = setFilters.mock.calls[1][0];
    const updatedStatus = updaterStatus(filters);
    expect(updatedStatus.isActive).toBe('');
  });
});
