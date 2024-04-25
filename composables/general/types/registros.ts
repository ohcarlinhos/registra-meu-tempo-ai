export type RegistroType = {
  descricao: string;
  registroDate: string | null;
  periodos: PeriodoType[];
  id?: number;
  categoriaId?: number | null;
  categoriaNome?: string;
  tempoFormatado?: string;
  periodosCount?: number;
};

export interface IRegistroLocal extends RegistroType {
  localUuid: string;
}

export interface IRegistroTable extends RegistroType {
  periodosCountText?: string;
}

export type RegistroFormType = {
  id?: number;
  descricao: string;
  categoria: string;
  categoriaId?: number;
  periodos: { inicio: Date | string; fim: Date | string }[];
  callback?: () => void;
};
