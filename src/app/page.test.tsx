// app/page.test.tsx

import { render, screen } from '@testing-library/react';
import HomePage from './page';

describe('HomePage', () => {
  it('deve renderizar o título corretamente', () => {
    render(<HomePage />);
    const title = screen.getByText(/Bem-vindo ao Sistema de Funcionários/i);
    expect(title).toBeInTheDocument();
  });

  it('deve renderizar a descrição corretamente', () => {
    render(<HomePage />);
    const description = screen.getByText(/Este sistema permite o cadastro, edição e gerenciamento de funcionários/i);
    expect(description).toBeInTheDocument();
  });
});
