export default (registro: RegistroDeTempoType, callback = () => {}) => {
  const categoriaStore = useCategoriaStore();

  const categoriaStored =
    registro.categoriaId &&
    categoriaStore.findCategoriaById(registro.categoriaId);

  return {
    id: registro.id,
    descricao: registro.descricao,
    categoria: categoriaStored ? categoriaStored.nome : "",
    categoriaId: registro.categoriaId || undefined,
    periodos: registro.periodos,
    callback,
  };
};

