// utils/formatEnum.test.ts

import { formatGender, formatPosition } from './formatEnum';

describe('formatGender', () => {
  it('retorna Masculino para Male', () => {
    expect(formatGender('Male')).toBe('Masculino');
  });

  it('retorna Feminino para Female', () => {
    expect(formatGender('Female')).toBe('Feminino');
  });

  it('retorna Outro para Other', () => {
    expect(formatGender('Other')).toBe('Outro');
  });

  it('retorna Desconhecido para valores não mapeados', () => {
    expect(formatGender('Unknown')).toBe('Desconhecido');
    expect(formatGender('')).toBe('Desconhecido');
  });
});

describe('formatPosition', () => {
  it('retorna Gerente para Manager', () => {
    expect(formatPosition('Manager')).toBe('Gerente');
  });

  it('retorna Desenvolvedor para Developer', () => {
    expect(formatPosition('Developer')).toBe('Desenvolvedor');
  });

  it('retorna Outro para valores não mapeados', () => {
    expect(formatPosition('Intern')).toBe('Outro');
    expect(formatPosition('')).toBe('Outro');
  });
});
