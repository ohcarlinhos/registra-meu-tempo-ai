export const getRegistrosDeTempo = async function () {
  return await CustomHttp<null, RegistroDeTempoType[]>(
    // TODO: remover parâmetros mocados
    "/registro-de-tempo?page=1&perPage=24",
    "get"
  );
};
