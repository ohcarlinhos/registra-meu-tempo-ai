export const useAuthStore = defineStore("AuthStore", () => {
  const authModal = reactive({ open: false });
  const needRefresh = ref(false);

  const openAuthModal = (_needRefresh = false) => {
    needRefresh.value = _needRefresh;
    authModal.open = true;
  };

  const closeAuthModal = () => {
    authModal.open = false;

    if (needRefresh.value) {
      needRefresh.value = false;
      location.reload();
    }
  };

  return {
    authModal,
    needRefresh,
    openAuthModal,
    closeAuthModal,
  };
});
