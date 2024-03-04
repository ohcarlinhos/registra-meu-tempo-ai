export type RegistroDeTempoType = {
  id: number;
  titulo: string;
  categoriaId: number | null;
  dataDoRegistro: string;
  nomeDaCategoria: string;
  tempoFormatado: string;
  periodos: PeriodoDeTempoType[];
  periodosCount: number;
  periodosCountText?: string;
};
