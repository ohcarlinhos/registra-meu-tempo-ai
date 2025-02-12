export const useCategoryStore = defineStore(
  "category-store",
  () => {
    const allCategories = ref<CategoryMap[]>([]);
    const isAllCategoriesFetch = ref(false);

    const fetchAllCategories = async (errorCallback: Function) => {
      try {
        isAllCategoriesFetch.value = true;
        allCategories.value = (await categoryApi().getAll()) || [];
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

    const {
      query: paginationQuery,
      setPage,
      setPerPage,
      setSearch,
      addFilter,
      removeFilter,
      updateSort,
    } = usePaginationQuery();
    const apiRes = ref<Pagination<CategoryMap>>();
    const isPaginationFetch = ref(false);

    const fetchData = async () => {
      try {
        isPaginationFetch.value = true;
        const data = await categoryApi().get(paginationQuery.value);
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

    const deleteCategory = async (id: number) => {
      try {
        isDeleteFetch.value = true;
        await categoryApi().delete(id);
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

      setPage,
      setPerPage,
      setSearch,
      addFilter,
      removeFilter,
      updateSort,

      fetchAllCategories,
      findCategoryById,
      allCategories,
      isAllCategoriesFetch,

      delete: deleteCategory,
      isDeleteFetch,
    };
  },
  {
    persist: true,
  }
);
