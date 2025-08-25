// app/components/footer/Footer.test.tsx

import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renderiza corretamente com o ano atual', () => {
    const currentYear = new Date().getFullYear();
    render(<Footer />);
    expect(
      screen.getByText(`© ${currentYear} Sistema de Funcionários. Todos os direitos reservados.`)
    ).toBeInTheDocument();
  });
});
