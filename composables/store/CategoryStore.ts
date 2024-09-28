export const useCategoryStore = defineStore("CategoryStore", {
  state: () => {
    return {
      paginationQuery: new PaginationQuery(),
      _categories: [] as CategoryMap[],
      _apiRes: {} as Pagination<CategoryMap>,
      _fetch: false,
      _deleteFetch: false,
    };
  },

  actions: {
    async fetchAllCategories(errorCallback: Function) {
      try {
        this._categories = (await getAllCategories()) || [];
      } catch (error) {
        ErrorToast(error);
        errorCallback();
      }
    },

    findCategoryById(id: number) {
      return this._categories.find((c) => c.id == id);
    },

    async refetch() {
      await this.fetch(true);
    },

    async fetch(mounted = false) {
      if (!this.paginationQuery) this.paginationQuery = new PaginationQuery();

      try {
        this._fetch = true;
        const data = await getCategories(this.paginationQuery, mounted);
        if (data) this._apiRes = data;
      } catch (error) {
        ErrorToast(error);
      } finally {
        this._fetch = false;
      }
    },

    async delete(id: number) {
      try {
        this._deleteFetch = true;
        await deleteCategory(id);
        await this.refetch();
      } finally {
        this._deleteFetch = false;
      }
    },
  },

  getters: {
    getAllCategories(state) {
      return state._categories;
    },

    apiRes: (state) => (state._apiRes!.data ? state._apiRes : null),

    isFetch: (state) => state._fetch || state._deleteFetch,

    categoryTableData: (state) => {
      const categoryTable: CategoryMap[] = [];

      if (state._apiRes!.data)
        state._apiRes.data.forEach((category) => {
          categoryTable.push({ ...category });
        });

      return categoryTable;
    },
  },

  persist: false,
});
