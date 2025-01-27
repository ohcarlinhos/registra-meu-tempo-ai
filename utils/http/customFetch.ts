const clearSession = (needRefresh = false) => {
  const { clearSession, openAuthModal } = useAuthStore();
  const { $i18n } = useNuxtApp();

  clearSession();
  openAuthModal(needRefresh);

  throw new Error($i18n.t("sessionExpiredError"));
};

export const useCustomFetch = (needRefresh = true, stopIfNotAuth = true) => {
  const { baseURL } = storeToRefs(useConfigStore());
  const { $i18n } = useNuxtApp();

  const authStore = useAuthStore();
  const { isAuth, jwt } = storeToRefs(authStore);

  return $fetch.create({
    baseURL: baseURL.value,

    onRequest({ options }) {
      if (isAuth.value) {
        options.headers.append("Authorization", `Bearer ${jwt.value?.token}`);
      }
    },

    onResponseError({ response }) {
      if (stopIfNotAuth && !isAuth.value) {
        clearSession(needRefresh);
        return;
      }

      if (response?.status === 401) {
        clearSession(needRefresh);
        return;
      }

      if (response?._data.message) {
        throw new Error(response?._data.message);
      }

      throw new Error($i18n.t("apiGenericError"));
    },
  });
};
