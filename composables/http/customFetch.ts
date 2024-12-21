const clearSession = (needRefresh = false) => {
  const { clearUserToken, openAuthModal } = useAuthStoreV2();
  const { $i18n } = useNuxtApp();

  clearUserToken();
  openAuthModal(needRefresh);

  throw new Error($i18n.t("sessionExpiredError"));
};

export const useCustomFetch = (needRefresh = true, stopIfNotAuth = true) => {
  const configStore = useConfigStore();
  const { $i18n } = useNuxtApp();

  const authStore = useAuthStoreV2();
  const { isAuth, userToken } = storeToRefs(authStore);

  return $fetch.create({
    baseURL: configStore.apiBase,

    onRequest({ options }) {
      if (userToken.value) {
        options.headers.append("Authorization", `Bearer ${userToken.value}`);
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
