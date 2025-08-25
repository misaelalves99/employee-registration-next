// lib/formatters.test.ts

import { formatDate, formatCurrency, formatEnum } from './formatters';

describe('formatDate', () => {
  it('deve formatar uma string de data corretamente', () => {
    expect(formatDate('2025-08-22')).toBe('22/08/2025');
  });

  it('deve formatar um objeto Date corretamente', () => {
    expect(formatDate(new Date('2025-08-22'))).toBe('22/08/2025');
  });
});

describe('formatCurrency', () => {
  it('deve formatar números como moeda BRL', () => {
    expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
    expect(formatCurrency(0)).toBe('R$ 0,00');
  });
});

describe('formatEnum', () => {
  it('deve adicionar espaços antes de letras maiúsculas e capitalizar a primeira letra', () => {
    expect(formatEnum('firstName')).toBe('First Name');
    expect(formatEnum('LastNameTest')).toBe('Last Name Test');
  });

  it('deve manter palavras únicas capitalizadas', () => {
    expect(formatEnum('gender')).toBe('Gender');
  });
});
