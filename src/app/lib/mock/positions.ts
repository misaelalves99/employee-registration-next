// lib/mock/positions.ts

import { Position } from '../../types/position'

export const mockPositions: Position[] = [
  'Desenvolvedor',
  'Analista',
  'Gerente',
  'Estagiário',
  'Outro',
]

export async function getMockPositions() {
  return mockPositions
}
