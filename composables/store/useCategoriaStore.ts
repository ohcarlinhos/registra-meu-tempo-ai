export const useCategoriaStore = defineStore("CategoriaStore", {
  state: () => {
    return {
      categorias: [] as CategoriaType[],
    };
  },

  actions: {
    async fetchCategoria() {
      try {
        this.categorias = (await getCategorias()).value;
      } catch (error) {
        ErrorToast(error);
      }
    },
  },

  getters: {
    getCategorias(state) {
      return state.categorias;
    },
  },

  persist: false,
});
