export const getCategorias = async function () {
  return await CustomHttp<null, CategoriaType[]>("/categoria", "get");
};
