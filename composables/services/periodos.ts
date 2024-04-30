type Payload = {
  registroId: number;
  inicio: Date;
  fim: Date;
};

export const getPeriodos = async function (registroId: number) {
  return await CustomHttp<null, PeriodoType[]>(`/periodo/${registroId}`, "get");
};
export const postPeriodo = async (payload: Payload) => {
  return CustomHttp<Payload, RegistroType>("/periodo", "post", payload);
};
