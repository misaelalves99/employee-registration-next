// app/privacy/page.test.tsx

import { render, screen } from '@testing-library/react';
import PrivacyPage from './page';

describe('PrivacyPage', () => {
  it('renderiza corretamente o título', () => {
    render(<PrivacyPage />);
    const heading = screen.getByRole('heading', { name: /Política de Privacidade/i });
    expect(heading).toBeInTheDocument();
  });

  it('renderiza o texto da política de privacidade', () => {
    render(<PrivacyPage />);
    const paragraph = screen.getByText(/Sua privacidade é importante para nós/i);
    expect(paragraph).toBeInTheDocument();
  });
});
