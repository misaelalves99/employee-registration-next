// types/position.ts

export const POSITIONS = [
  'Desenvolvedor',
  'Analista',
  'Gerente',
  'Estagiário',
  'Designer', 
  'Outro',
] as const;

export type Position = typeof POSITIONS[number];
export type PositionFormValue = '' | Position;
