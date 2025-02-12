export const useAllCategoriesStore = defineStore(
  "all-categories-store",
  () => {
    const data = ref<CategoryMap[]>([]);
    const isFetch = ref(false);

    const fetchData = async (errorCallback: Function) => {
      try {
        isFetch.value = true;
        data.value = (await categoryApi().getAll()) || [];
      } catch (error) {
        ErrorToast(error);
        errorCallback();
      } finally {
        isFetch.value = false;
      }
    };

    const findCategoryById = (id: number) => {
      return data.value.find((c) => c.id == id);
    };

    return {
      fetchData,
      findCategoryById,
      data,
      isFetch,
    };
  },
  {
    persist: true,
  }
);
