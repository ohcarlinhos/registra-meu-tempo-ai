export const getRegistros = async function () {
  return await CustomHttp<null, RegistroType[]>(
    // TODO: remover parâmetros mocados
    "/registro-de-tempo?page=1&perPage=24",
    "get"
  );
};

export const getRegistroById = async function (id: number) {
  return await CustomHttp<null, RegistroType>(
    `/registro-de-tempo/${id}`,
    "get"
  );
};

export const deleteRegistro = async (id: number) => {
  return await CustomHttp<null, RegistroType>(
    `/registro-de-tempo/${id}`,
    "delete"
  );
};

type Payload = {
  descricao: string;
  periodos: { inicio: Date | string; fim: Date | string }[];
  categoriaId?: number | null;
};

export const postRegistro = async (payload: Payload) => {
  if (payload.categoriaId == null) delete payload.categoriaId;

  return CustomHttp<Payload, RegistroType>(
    "/registro-de-tempo",
    "post",
    payload
  );
};
