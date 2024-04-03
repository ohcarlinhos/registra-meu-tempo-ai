export type RegistroDeTempoType = {
  descricao: string;
  registroDate: string | null;
  periodos: PeriodoDeTempoType[];
  id?: number;
  categoriaId?: number | null;
  categoriaNome?: string;
  tempoFormatado?: string;
  periodosCount?: number;
};

export interface IRegistroDeTempoLocal extends RegistroDeTempoType {
  localUuid: string;
}

export interface IRegistroDeTempoTable extends RegistroDeTempoType {
  periodosCountText?: string;
}
