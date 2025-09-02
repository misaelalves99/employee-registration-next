// components/modal/Modal.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('Modal', () => {
  const title = 'Título do Modal';
  const bodyContent = <p>Conteúdo do Modal</p>;
  const onClose = jest.fn();
  const onConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('não renderiza quando isOpen é false', () => {
    render(
      <Modal
        isOpen={false}
        title={title}
        body={bodyContent}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    expect(screen.queryByText(title)).not.toBeInTheDocument();
    expect(screen.queryByText('Conteúdo do Modal')).not.toBeInTheDocument();
  });

  it('renderiza corretamente quando isOpen é true', () => {
    render(
      <Modal
        isOpen={true}
        title={title}
        body={bodyContent}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText('Conteúdo do Modal')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Confirmar')).toBeInTheDocument();
  });

  it('chama onClose ao clicar no botão de cancelar', () => {
    render(
      <Modal
        isOpen={true}
        title={title}
        body={bodyContent}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    fireEvent.click(screen.getByText('Cancelar'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('chama onConfirm ao clicar no botão de confirmar', () => {
    render(
      <Modal
        isOpen={true}
        title={title}
        body={bodyContent}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    fireEvent.click(screen.getByText('Confirmar'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('renderiza rótulos customizados nos botões', () => {
    render(
      <Modal
        isOpen={true}
        title={title}
        body={bodyContent}
        onClose={onClose}
        onConfirm={onConfirm}
        confirmLabel="Sim"
        cancelLabel="Não"
      />
    );

    expect(screen.getByText('Sim')).toBeInTheDocument();
    expect(screen.getByText('Não')).toBeInTheDocument();
  });

  it('renderiza qualquer ReactNode passado como body', () => {
    const customBody = (
      <div>
        <span data-testid="custom-span">Texto Customizado</span>
      </div>
    );

    render(
      <Modal
        isOpen={true}
        title={title}
        body={customBody}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByTestId('custom-span')).toHaveTextContent('Texto Customizado');
  });
});
