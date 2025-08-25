// app/employee/components/FilterPanel.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import FilterPanel from './FilterPanel';

describe('FilterPanel', () => {
  it('renderiza os campos de filtro corretamente', () => {
    const mockFn = jest.fn();
    render(<FilterPanel onFilterChange={mockFn} />);

    expect(screen.getByText('Filtros')).toBeInTheDocument();
    expect(screen.getByLabelText('Cargo')).toBeInTheDocument();
    expect(screen.getByLabelText('Departamento')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Aplicar Filtros' })).toBeInTheDocument();
  });

  it('chama onFilterChange com os valores preenchidos', () => {
    const mockFn = jest.fn();
    render(<FilterPanel onFilterChange={mockFn} />);

    fireEvent.change(screen.getByLabelText('Cargo'), { target: { value: 'Gerente' } });
    fireEvent.change(screen.getByLabelText('Departamento'), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar Filtros' }));

    expect(mockFn).toHaveBeenCalledWith({ position: 'Gerente', departmentId: 5 });
  });

  it('chama onFilterChange com undefined quando campos estão vazios', () => {
    const mockFn = jest.fn();
    render(<FilterPanel onFilterChange={mockFn} />);

    fireEvent.click(screen.getByRole('button', { name: 'Aplicar Filtros' }));

    expect(mockFn).toHaveBeenCalledWith({ position: undefined, departmentId: undefined });
  });

  it('chama onFilterChange apenas com position quando só cargo é preenchido', () => {
    const mockFn = jest.fn();
    render(<FilterPanel onFilterChange={mockFn} />);

    fireEvent.change(screen.getByLabelText('Cargo'), { target: { value: 'Analista' } });
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar Filtros' }));

    expect(mockFn).toHaveBeenCalledWith({ position: 'Analista', departmentId: undefined });
  });

  it('chama onFilterChange apenas com departmentId quando só departamento é preenchido', () => {
    const mockFn = jest.fn();
    render(<FilterPanel onFilterChange={mockFn} />);

    fireEvent.change(screen.getByLabelText('Departamento'), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar Filtros' }));

    expect(mockFn).toHaveBeenCalledWith({ position: undefined, departmentId: 10 });
  });
});
