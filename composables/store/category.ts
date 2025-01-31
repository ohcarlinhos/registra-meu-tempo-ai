export const useCategoryStore = defineStore(
  "category-store",
  () => {
    const allCategories = ref<CategoryMap[]>([]);
    const isAllCategoriesFetch = ref(false);

    const fetchAllCategories = async (errorCallback: Function) => {
      try {
        isAllCategoriesFetch.value = true;
        allCategories.value = (await getAllCategories()) || [];
      } catch (error) {
        ErrorToast(error);
        errorCallback();
      } finally {
        isAllCategoriesFetch.value = false;
      }
    };

    const findCategoryById = (id: number) => {
      return allCategories.value.find((c) => c.id == id);
    };

    const paginationQuery = ref<PaginationQuery>(new PaginationQuery());
    const apiRes = ref<Pagination<CategoryMap>>();
    const isPaginationFetch = ref(false);

    const fetchData = async () => {
      if (!paginationQuery.value) paginationQuery.value = new PaginationQuery();

      try {
        isPaginationFetch.value = true;
        const data = await getCategories(paginationQuery.value);
        if (data) apiRes.value = data;
      } catch (error) {
        ErrorToast(error);
      } finally {
        isPaginationFetch.value = false;
      }
    };

    const refetchData = async () => {
      await fetchData();
    };

    const isDeleteFetch = ref(false);

    const deleteCategoryMethod = async (id: number) => {
      try {
        isDeleteFetch.value = true;
        await deleteCategory(id);
        await refetchData();
      } finally {
        isDeleteFetch.value = false;
      }
    };

    const isFetch = computed(() => {
      return isDeleteFetch.value || isPaginationFetch.value;
    });

    const categoryTableData = computed(() => {
      const table: CategoryMap[] = [];

      if (apiRes.value?.data)
        apiRes.value.data.forEach((category) => {
          table.push({ ...category });
        });

      return table;
    });

    return {
      fetchData,
      refetchData,
      paginationQuery,
      apiRes,
      isPaginationFetch,
      isFetch,
      categoryTableData,

      fetchAllCategories,
      findCategoryById,
      allCategories,
      isAllCategoriesFetch,

      deleteCategoryMethod,
      isDeleteFetch,
    };
  },
  {
    persist: true,
  }
);
