export const getCategorias = async function () {
  return await CustomHttp<null, CategoriaType[]>("/categoria", "get");
};

type Payload = { nome: string };

export const postCategoria = async (payload: Payload) => {
  return await CustomHttp<Payload, CategoriaType>(
    "/categoria",
    "post",
    payload
  );
};
