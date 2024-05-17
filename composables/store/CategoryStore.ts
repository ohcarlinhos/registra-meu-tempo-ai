export const useCategoryStore = defineStore("CategoryStore", {
  state: () => {
    return {
      _categories: [] as CategoryType[],
      _apiRes: {} as Pagination<CategoryType>,
      _fetching: false,
      _deletingTimeRecord: false,
    };
  },

  actions: {
    async fetchAllCategories(errorCallback: Function) {
      try {
        this._categories = (await getAllCategories()).value;
      } catch (error) {
        ErrorToast(error);
        errorCallback();
      }
    },

    findCategoryById(id: number) {
      return this._categories.find((c) => c.id == id);
    },

    async fetchCategories(page = 1, perPage = 5, search = "") {
      try {
        this._fetching = true;
        const data = await getCategories(page, perPage, search);
        this._apiRes = data.value;
      } catch (error) {
        ErrorToast(error);
      } finally {
        this._fetching = false;
      }
    },

    async deleteCategory(id: number, page = 1, perPage = 5) {
      try {
        this._deletingTimeRecord = true;
        await deleteCategory(id);
        await this.fetchCategories(page, perPage);
      } finally {
        this._deletingTimeRecord = false;
      }
    },
  },

  getters: {
    getAllCategories(state) {
      return state._categories;
    },

    apiRes: (state) => (state._apiRes!.data ? state._apiRes : null),
    fetching: (state) => state._fetching || state._deletingTimeRecord,

    categoryTableData: (state) => {
      const categoryTable: CategoryType[] = [];

      if (state._apiRes!.data)
        state._apiRes.data.forEach((category) => {
          categoryTable.push({ ...category });
        });

      return categoryTable;
    },
  },

  persist: false,
});
