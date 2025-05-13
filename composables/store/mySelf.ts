export const useMySelfStore = defineStore("MySelfStore", () => {
  const mySelf = ref<UserMap>();
  const isFetch = ref(false);

  const fetchMySelf = async (callback: (data: UserMap) => void = () => {}) => {
    try {
      isFetch.value = true;
      const data = await userApi().getMySelf();

      if (data) {
        mySelf.value = data;
        callback(data);
      }
    } catch (error) {
      ErrorToast(error);
    } finally {
      isFetch.value = false;
    }
  };

  const isActive = computed(() => {
    return Boolean(mySelf.value?.isActive);
  });

  const clearMySelf = () => {
    mySelf.value = undefined;
  };

  return {
    mySelf,
    isFetch,
    isActive,
    fetchMySelf,
    clearMySelf,
  };
});
