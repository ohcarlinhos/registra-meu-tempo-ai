import { defineStore } from "pinia";

export const useUserStore = defineStore(
  "user-store",
  () => {
    const mySelf = ref<UserMap>();
    const isFetch = ref(false);

    const fetchMySelf = async (
      callback: (data: UserMap) => void = () => {}
    ) => {
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

    const isVerified = computed(() => {
      return Boolean(mySelf.value?.isVerified);
    });

    const isActive = computed(() => {
      return Boolean(mySelf.value?.isActive);
    });

    const checkIfIsVerified = async () => {
      await fetchMySelf();

      return mySelf.value?.isVerified;
    };

    const clearMySelf = () => {
      mySelf.value = undefined;
    };

    return {
      mySelf,
      isFetch,
      isActive,
      isVerified,
      fetchMySelf,
      checkIfIsVerified,
      clearMySelf,
    };
  },
  { persist: false }
);
