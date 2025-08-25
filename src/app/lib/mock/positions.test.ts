// lib/mock/positions.test.ts

import { getMockPositions, mockPositions } from './positions';

describe('mockPositions', () => {
  it('mockPositions contém os cargos esperados', () => {
    expect(mockPositions).toEqual(
      expect.arrayContaining(['Desenvolvedor', 'Analista', 'Gerente', 'Estagiário', 'Outro'])
    );
  });

  it('getMockPositions retorna uma Promise com os cargos', async () => {
    const positions = await getMockPositions();
    expect(Array.isArray(positions)).toBe(true);
    expect(positions).toEqual(mockPositions);
  });
});
