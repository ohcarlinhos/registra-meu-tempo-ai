type Payload = { nome: string };

export const postCategoria = async (payload: Payload) => {
  return await CustomHttp<Payload, CategoriaType>(
    "/categoria",
    "post",
    payload
  );
};
