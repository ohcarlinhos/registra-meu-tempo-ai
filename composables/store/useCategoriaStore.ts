export const useCategoriaStore = defineStore("CategoriaStore", {
  state: () => {
    return {
      categorias: [] as string[],
    };
  },

  actions: {
    async fetchCategoria() {
      try {
        const data = await getCategorias();

        this.categorias = data.value.map((c) => c.nome);
      } catch (err) {
        console.log("deu ruim");
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
