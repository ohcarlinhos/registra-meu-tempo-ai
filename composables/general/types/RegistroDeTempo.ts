export type RegistroDeTempoType = {
  id?: number;
  titulo: string;
  categoriaId?: number | null;
  nomeDaCategoria?: string;
  dataDoRegistro: string;
  tempoFormatado?: string;
  periodos: PeriodoDeTempoType[];
  periodosCount?: number;
  periodosCountText?: string;
};
