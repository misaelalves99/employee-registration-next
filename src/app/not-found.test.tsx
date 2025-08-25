// app/not-found.test.tsx

import { render, screen } from '@testing-library/react';
import NotFound from './not-found';
import '@testing-library/jest-dom';

describe('NotFound', () => {
  it('deve renderizar o título de erro', () => {
    render(<NotFound />);
    const title = screen.getByText(/Erro 404/i);
    expect(title).toBeInTheDocument();
  });

  it('deve renderizar a mensagem de página não encontrada', () => {
    render(<NotFound />);
    const message = screen.getByText(/A página que você está procurando não foi encontrada/i);
    expect(message).toBeInTheDocument();
  });

  it('deve renderizar o link para voltar à página inicial', () => {
    render(<NotFound />);
    const link = screen.getByRole('link', { name: /Voltar à página inicial/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
