export const useCategoryStore = defineStore(
  "category-store",
  () => {
    const {
      query: paginationQuery,
      setPage,
      setPerPage,
      setSearch,
      addFilter,
      removeFilter,
      updateSort,
      updatePaginationQueryWithRoute,
    } = usePaginationQuery("c_");

    const apiRes = ref<Pagination<CategoryMap>>();
    const isPaginationFetch = ref(false);

    const fetchData = async (updatePaginationQuery = true) => {
      if (updatePaginationQuery) {
        updatePaginationQueryWithRoute();
      }

      isPaginationFetch.value = true;

      try {
        const data = await categoryApi().get(paginationQuery.value);
        if (data) apiRes.value = data;
      } catch (error) {
        ErrorToast(error);
      } finally {
        isPaginationFetch.value = false;
      }
    };

    const refetchData = async () => {
      await fetchData(false);
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

    const tableData = computed(() => {
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
      tableData,

      setPage,
      setPerPage,
      setSearch,
      addFilter,
      removeFilter,
      updateSort,

      delete: deleteCategory,
      isDeleteFetch,
    };
  },
  {
    persist: false,
  }
);
