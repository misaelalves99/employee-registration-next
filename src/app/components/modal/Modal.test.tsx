// components/modal/Modal.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('Modal', () => {
  const title = 'Título do Modal';
  const bodyText = 'Conteúdo do Modal';

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
        body={<p>{bodyText}</p>}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );
    expect(screen.queryByText(title)).not.toBeInTheDocument();
    expect(screen.queryByText(bodyText)).not.toBeInTheDocument();
  });

  it('renderiza corretamente quando isOpen é true', () => {
    render(
      <Modal
        isOpen={true}
        title={title}
        body={<p>{bodyText}</p>}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(bodyText)).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Confirmar')).toBeInTheDocument();
  });

  it('chama onClose ao clicar no botão de cancelar', () => {
    render(
      <Modal
        isOpen={true}
        title={title}
        body={<p>{bodyText}</p>}
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
        body={<p>{bodyText}</p>}
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
        body={<p>{bodyText}</p>}
        onClose={onClose}
        onConfirm={onConfirm}
        confirmLabel="Sim"
        cancelLabel="Não"
      />
    );

    expect(screen.getByText('Sim')).toBeInTheDocument();
    expect(screen.getByText('Não')).toBeInTheDocument();
  });
});
