// utils/formatEnum.ts

export const formatGender = (gender: string): string => {
  switch (gender) {
    case 'Male': return 'Masculino';
    case 'Female': return 'Feminino';
    case 'Other': return 'Outro';
    default: return 'Desconhecido';
  }
};

export const formatPosition = (position: string): string => {
  switch (position) {
    case 'Manager': return 'Gerente';
    case 'Developer': return 'Desenvolvedor';
    default: return 'Outro';
  }
};
