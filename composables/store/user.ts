import { defineStore } from "pinia";

export const useUserStore = defineStore("user-store", () => {
  const mySelf = ref<UserMap>();
  const isFetch = ref(false);

  const fetchMySelf = async (callback: (data: UserMap) => void = () => {}) => {
    try {
      isFetch.value = true;
      const data = await getMySelf();

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

  return {
    mySelf,
    isFetch,
    fetchMySelf,
  };
});
