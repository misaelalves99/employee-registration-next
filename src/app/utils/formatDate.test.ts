// utils/formatDate.test.ts

import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('formata corretamente uma string de data', () => {
    const input = '2023-08-22T00:00:00.000Z';
    const formatted = formatDate(input);
    expect(formatted).toBe('22/08/2023');
  });

  it('formata corretamente um objeto Date', () => {
    const input = new Date('2023-08-22T00:00:00.000Z');
    const formatted = formatDate(input);
    expect(formatted).toBe('22/08/2023');
  });

  it('garante que o retorno seja string', () => {
    const input = new Date();
    const formatted = formatDate(input);
    expect(typeof formatted).toBe('string');
  });
});
