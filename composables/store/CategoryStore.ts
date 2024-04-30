export const useCategoryStore = defineStore("CategoryStore", {
  state: () => {
    return {
      _categories: [] as CategoryType[],
    };
  },

  actions: {
    async fetchCategories(errorCallback: Function) {
      try {
        this._categories = (await getCategories()).value;
      } catch (error) {
        ErrorToast(error);
        errorCallback();
      }
    },

    findCategoryById(id: number) {
      return this._categories.find((c) => c.id == id);
    },
  },

  getters: {
    getCategories(state) {
      return state._categories;
    },
  },

  persist: false,
});
