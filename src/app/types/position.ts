// types/position.ts

export const POSITIONS = [
  'Desenvolvedor',
  'Analista',
  'Gerente',
  'Estagiário',
  'Outro',
] as const;

export type Position = typeof POSITIONS[number];
export type PositionFormValue = '' | Position;
