type Payload = {
  titulo: string;
  dataDoRegistro: Date | string;
  periodos: { inicio: Date | string; fim: Date | string }[];
};

export const postRegistroDeTempo = async (payload: Payload) => {
  return await CustomHttp<Payload, RegistroDeTempoType>(
    "/registro-de-tempo",
    "post",
    payload
  );
};
