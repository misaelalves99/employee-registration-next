// app/components/employee/EmployeeToggleStatusButton.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import EmployeeToggleStatusButton from './EmployeeToggleStatusButton';

// Mock do servidor
const server = setupServer(
  http.post('/api/employee/inactivate/:id', () => {
    return HttpResponse.json({}, { status: 200 });
  }),
  http.post('/api/employee/reactivate/:id', () => {
    return HttpResponse.json({}, { status: 200 });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('EmployeeToggleStatusButton', () => {
  it('renderiza botão com texto e título corretos quando isActive=true', () => {
    render(<EmployeeToggleStatusButton employeeId={1} isActive={true} onToggle={() => {}} />);
    expect(screen.getByRole('button', { name: 'Inativo' })).toBeInTheDocument();
    expect(screen.getByTitle('Inativar Funcionário')).toBeInTheDocument();
  });

  it('renderiza botão com texto e título corretos quando isActive=false', () => {
    render(<EmployeeToggleStatusButton employeeId={1} isActive={false} onToggle={() => {}} />);
    expect(screen.getByRole('button', { name: 'Ativo' })).toBeInTheDocument();
    expect(screen.getByTitle('Ativar Funcionário')).toBeInTheDocument();
  });

  it('chama API de inativar e onToggle quando isActive=true', async () => {
    const onToggleMock = jest.fn();
    render(<EmployeeToggleStatusButton employeeId={123} isActive={true} onToggle={onToggleMock} />);

    fireEvent.click(screen.getByRole('button', { name: 'Inativo' }));

    await waitFor(() => {
      expect(onToggleMock).toHaveBeenCalledWith(false);
    });
  });

  it('chama API de reativar e onToggle quando isActive=false', async () => {
    const onToggleMock = jest.fn();
    render(<EmployeeToggleStatusButton employeeId={456} isActive={false} onToggle={onToggleMock} />);

    fireEvent.click(screen.getByRole('button', { name: 'Ativo' }));

    await waitFor(() => {
      expect(onToggleMock).toHaveBeenCalledWith(true);
    });
  });

  it('exibe alerta e não chama onToggle em caso de erro na API', async () => {
    server.use(
      http.post('/api/employee/inactivate/:id', () => {
        return HttpResponse.json({ message: 'Erro' }, { status: 500 });
      })
    );

    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const onToggleMock = jest.fn();

    render(<EmployeeToggleStatusButton employeeId={1} isActive={true} onToggle={onToggleMock} />);
    fireEvent.click(screen.getByRole('button', { name: 'Inativo' }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Erro ao atualizar status.');
      expect(onToggleMock).not.toHaveBeenCalled();
    });

    alertMock.mockRestore();
  });

  it('desabilita botão enquanto a requisição está em andamento', async () => {
    let resolveRequest: Function;
    server.use(
      http.post('/api/employee/inactivate/:id', () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        })
      )
    );

    const onToggleMock = jest.fn();
    render(<EmployeeToggleStatusButton employeeId={1} isActive={true} onToggle={onToggleMock} />);
    const button = screen.getByRole('button', { name: 'Inativo' });

    fireEvent.click(button);
    expect(button).toBeDisabled();

    resolveRequest!({ status: 200 });
    await waitFor(() => expect(button).not.toBeDisabled());
  });
});
