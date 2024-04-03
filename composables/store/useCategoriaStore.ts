export const useCategoriaStore = defineStore("CategoriaStore", {
  state: () => {
    return {
      categorias: [] as CategoriaType[],
    };
  },

  actions: {
    async fetchCategoria(errorCallback: Function) {
      try {
        this.categorias = (await getCategorias()).value;
      } catch (error) {
        ErrorToast(error);
        errorCallback();
      }
    },

    findCategoriaById(id: number) {
      return this.categorias.find((c) => c.id == id);
    },
  },

  getters: {
    getCategorias(state) {
      return state.categorias;
    },
  },

  persist: false,
});
