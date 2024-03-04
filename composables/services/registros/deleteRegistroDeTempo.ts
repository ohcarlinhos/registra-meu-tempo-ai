export const deleteRegistroDeTempo = async (id: number) => {
  return await CustomHttp<null, RegistroDeTempoType>(
    `/registro-de-tempo/${id}`,
    "delete"
  );
};
