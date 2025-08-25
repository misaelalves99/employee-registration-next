// utils/formatStatus.test.ts

import { formatStatus } from './formatStatus';

describe('formatStatus', () => {
  it('retorna "Ativo" quando isActive é true', () => {
    expect(formatStatus(true)).toBe('Ativo');
  });

  it('retorna "Inativo" quando isActive é false', () => {
    expect(formatStatus(false)).toBe('Inativo');
  });
});
