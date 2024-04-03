type Payload = {
  descricao: string;
  periodos: { inicio: Date | string; fim: Date | string }[];
  categoriaId?: number | null;
};

export const postRegistroDeTempo = async (payload: Payload) => {
  if (payload.categoriaId == null) delete payload.categoriaId;

  return CustomHttp<Payload, RegistroDeTempoType>(
    "/registro-de-tempo",
    "post",
    payload
  );
};
