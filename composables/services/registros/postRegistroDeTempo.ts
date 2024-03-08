type Payload = {
  titulo: string;
  dataDoRegistro: Date | string;
  periodos: { inicio: Date | string; fim: Date | string }[];
  categoriaId?: number | null;
  categoria?: string;
};

export const postRegistroDeTempo = async (payload: Payload) => {
  if (payload.categoriaId == null) delete payload.categoriaId;
  if (payload.categoria) delete payload.categoria;

  return CustomHttp<Payload, RegistroDeTempoType>(
    "/registro-de-tempo",
    "post",
    payload
  );
};
