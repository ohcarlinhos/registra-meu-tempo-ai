export type RegistroFormType = {
  id?: number;
  descricao: string;
  categoria: string;
  categoriaId?: number;
  periodos: { inicio: Date | string; fim: Date | string }[];
  callback?: () => void;
};

