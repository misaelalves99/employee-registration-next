// app/components/employee/EmployeeFilter.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import EmployeeFilter from './EmployeeFilter';
import { POSITIONS } from '../../../app/types/position';

describe('EmployeeFilter', () => {
  let mockOnFilterChange: jest.Mock;

  beforeEach(() => {
    mockOnFilterChange = jest.fn();
    render(<EmployeeFilter onFilterChange={mockOnFilterChange} />);
  });

  it('renderiza todos os campos do formulário corretamente', () => {
    expect(screen.getByLabelText(/Buscar/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Departamento \(ID\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cargo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Admissão de/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Até/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Filtrar/i })).toBeInTheDocument();
  });

  it('chama onFilterChange com os filtros preenchidos corretamente', () => {
    fireEvent.change(screen.getByLabelText(/Buscar/i), { target: { value: 'João' } });
    fireEvent.change(screen.getByLabelText(/Departamento \(ID\)/i), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText(/Cargo/i), { target: { value: POSITIONS[0] } });
    fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: 'true' } });
    fireEvent.change(screen.getByLabelText(/Admissão de/i), { target: { value: '2023-01-01' } });
    fireEvent.change(screen.getByLabelText(/Até/i), { target: { value: '2023-12-31' } });

    fireEvent.click(screen.getByRole('button', { name: /Filtrar/i }));

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      search: 'João',
      departmentId: 5,
      position: POSITIONS[0],
      isActive: true,
      admissionDateFrom: '2023-01-01',
      admissionDateTo: '2023-12-31',
    });
  });

  it('não envia valores vazios, apenas campos preenchidos', () => {
    fireEvent.click(screen.getByRole('button', { name: /Filtrar/i }));
    expect(mockOnFilterChange).toHaveBeenCalledWith({});
  });

  it('converte status "false" para booleano false', () => {
    fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: 'false' } });
    fireEvent.click(screen.getByRole('button', { name: /Filtrar/i }));

    expect(mockOnFilterChange).toHaveBeenCalledWith({ isActive: false });
  });

  it('converte status "true" para booleano true', () => {
    fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: 'true' } });
    fireEvent.click(screen.getByRole('button', { name: /Filtrar/i }));

    expect(mockOnFilterChange).toHaveBeenCalledWith({ isActive: true });
  });

  it('ignora departmentId não numérico e envia undefined', () => {
    fireEvent.change(screen.getByLabelText(/Departamento \(ID\)/i), { target: { value: 'abc' } });
    fireEvent.click(screen.getByRole('button', { name: /Filtrar/i }));

    expect(mockOnFilterChange).toHaveBeenCalledWith({});
  });

  it('permite filtrar apenas por campos individuais', () => {
    fireEvent.change(screen.getByLabelText(/Buscar/i), { target: { value: 'Ana' } });
    fireEvent.click(screen.getByRole('button', { name: /Filtrar/i }));

    expect(mockOnFilterChange).toHaveBeenCalledWith({ search: 'Ana' });

    fireEvent.change(screen.getByLabelText(/Cargo/i), { target: { value: POSITIONS[1] } });
    fireEvent.click(screen.getByRole('button', { name: /Filtrar/i }));

    expect(mockOnFilterChange).toHaveBeenCalledWith({ position: POSITIONS[1] });
  });
});
