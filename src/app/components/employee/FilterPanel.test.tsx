// app/employee/components/FilterPanel.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import FilterPanel from './FilterPanel';

describe('FilterPanel', () => {
  let mockFn: jest.Mock;

  beforeEach(() => {
    mockFn = jest.fn();
    render(<FilterPanel onFilterChange={mockFn} />);
  });

  it('renderiza título, campos e botão', () => {
    expect(screen.getByText('Filtros')).toBeInTheDocument();
    expect(screen.getByLabelText('Cargo')).toBeInTheDocument();
    expect(screen.getByLabelText('Departamento')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Aplicar Filtros' })).toBeInTheDocument();
  });

  it('chama onFilterChange com valores preenchidos corretamente', () => {
    fireEvent.change(screen.getByLabelText('Cargo'), { target: { value: 'Gerente' } });
    fireEvent.change(screen.getByLabelText('Departamento'), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar Filtros' }));

    expect(mockFn).toHaveBeenCalledWith({ position: 'Gerente', departmentId: 5 });
  });

  it('chama onFilterChange com undefined quando campos estão vazios', () => {
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar Filtros' }));
    expect(mockFn).toHaveBeenCalledWith({ position: undefined, departmentId: undefined });
  });

  it('chama onFilterChange apenas com position quando só cargo é preenchido', () => {
    fireEvent.change(screen.getByLabelText('Cargo'), { target: { value: 'Analista' } });
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar Filtros' }));

    expect(mockFn).toHaveBeenCalledWith({ position: 'Analista', departmentId: undefined });
  });

  it('chama onFilterChange apenas com departmentId quando só departamento é preenchido', () => {
    fireEvent.change(screen.getByLabelText('Departamento'), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar Filtros' }));

    expect(mockFn).toHaveBeenCalledWith({ position: undefined, departmentId: 10 });
  });

  it('trata corretamente valores inválidos de departmentId', () => {
    fireEvent.change(screen.getByLabelText('Departamento'), { target: { value: 'abc' } });
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar Filtros' }));

    // Deve retornar undefined porque Number('abc') é NaN
    expect(mockFn).toHaveBeenCalledWith({ position: undefined, departmentId: undefined });
  });
});
