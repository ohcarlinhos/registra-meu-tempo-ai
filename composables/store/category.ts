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

      delete: deleteCategory,
      isDeleteFetch,
    };
  },
  {
    persist: true,
  }
);
