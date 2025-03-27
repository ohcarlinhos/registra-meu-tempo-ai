export const useAllCategoriesStore = defineStore(
  "all-categories-store",
  () => {
    const data = ref<CategoryMap[]>([]);
    const isFetching = ref(false);

    const fetchData = async (errorCallback: Function) => {
      try {
        isFetching.value = true;
        data.value = (await categoryApi().getAll()) || [];
      } catch (error) {
        ErrorToast(error);
        errorCallback();
      } finally {
        isFetching.value = false;
      }
    };

    const findCategoryById = (id: number) => {
      return data.value.find((c) => c.id == id);
    };

    return {
      fetchData,
      findCategoryById,
      data,
      isFetching,
    };
  },
  {
    persist: true,
  }
);
