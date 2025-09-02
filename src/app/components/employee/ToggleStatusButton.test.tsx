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
  it('renderiza corretamente com status inicial ativo', () => {
    render(<ToggleStatusButton employeeId={employeeId} initialStatus={true} onStatusChange={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Inativar' })).toBeInTheDocument();
  });

  it('renderiza corretamente com status inicial inativo', () => {
    render(<ToggleStatusButton employeeId={employeeId} initialStatus={false} onStatusChange={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Ativar' })).toBeInTheDocument();
  });

  it('mostra "Carregando..." enquanto a requisição está em andamento', async () => {
    render(<ToggleStatusButton employeeId={employeeId} initialStatus={false} onStatusChange={jest.fn()} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('altera status corretamente após requisição bem-sucedida', async () => {
    const onStatusChangeMock = jest.fn();
    render(<ToggleStatusButton employeeId={employeeId} initialStatus={false} onStatusChange={onStatusChangeMock} />);
    
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Inativar' })).toBeInTheDocument();
      expect(onStatusChangeMock).toHaveBeenCalledWith(true);
    });
  });

  it('exibe alerta em caso de erro na requisição', async () => {
    window.alert = jest.fn();

    server.use(
      http.post(`/api/employees/${employeeId}/toggle-status`, async () => {
        return HttpResponse.json({ message: 'Erro' }, { status: 500 });
      })
    );

    render(<ToggleStatusButton employeeId={employeeId} initialStatus={false} onStatusChange={jest.fn()} />);
    
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Erro ao alterar status');
    });
  });

  it('desabilita botão durante a requisição e reabilita após conclusão', async () => {
    render(<ToggleStatusButton employeeId={employeeId} initialStatus={false} onStatusChange={jest.fn()} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});
