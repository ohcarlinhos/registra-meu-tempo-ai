export type RegistroDeTempo = {
  id: number;
  titulo: string;
  categoriaId: number | null;
  dataDoRegistro: string;
  nomeDaCategoria: string;
  tempoFormatado: string;
};
