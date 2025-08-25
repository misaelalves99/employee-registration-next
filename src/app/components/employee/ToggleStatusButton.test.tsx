// app/employee/components/ToggleStatusButton.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ToggleStatusButton from './ToggleStatusButton';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const employeeId = 1;

const server = setupServer(
  http.post(`/api/employees/${employeeId}/toggle-status`, async () => {
    return HttpResponse.json({ isActive: true }, { status: 200 });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ToggleStatusButton', () => {
  it('renderiza corretamente com status inicial', () => {
    render(
      <ToggleStatusButton
        employeeId={employeeId}
        initialStatus={true}
        onStatusChange={jest.fn()}
      />
    );
    expect(screen.getByRole('button', { name: 'Inativar' })).toBeInTheDocument();
  });

  it('mostra "Carregando..." enquanto faz a requisição', async () => {
    render(
      <ToggleStatusButton
        employeeId={employeeId}
        initialStatus={false}
        onStatusChange={jest.fn()}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('altera status para ativo após requisição bem-sucedida', async () => {
    const mockFn = jest.fn();
    render(
      <ToggleStatusButton
        employeeId={employeeId}
        initialStatus={false}
        onStatusChange={mockFn}
      />
    );

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Inativar' })).toBeInTheDocument();
      expect(mockFn).toHaveBeenCalledWith(true);
    });
  });

  it('exibe alerta em caso de erro na requisição', async () => {
    window.alert = jest.fn();

    server.use(
      http.post(`/api/employees/${employeeId}/toggle-status`, async () => {
        return HttpResponse.json({ message: 'Erro' }, { status: 500 });
      })
    );

    render(
      <ToggleStatusButton
        employeeId={employeeId}
        initialStatus={false}
        onStatusChange={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Erro ao alterar status');
    });
  });

  it('desabilita botão durante requisição', async () => {
    render(
      <ToggleStatusButton
        employeeId={employeeId}
        initialStatus={false}
        onStatusChange={jest.fn()}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});
