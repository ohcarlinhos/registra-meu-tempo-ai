const clearSession = (needRefresh = false) => {
  const { clear } = useUserSession();
  const { openAuthModal } = useAuthStore();
  const { $i18n } = useNuxtApp();

  clear();
  openAuthModal(needRefresh);

  throw new Error($i18n.t("sessionExpiredError"));
};

export const useCustomFetch = (needRefresh = true, stopIfNotAuth = true) => {
  const runtime = useRuntimeConfig();
  const { $i18n } = useNuxtApp();

  const { loggedIn, session } = useUserSession();

  return $fetch.create({
    baseURL: runtime.public.externalBaseURL,

    onRequest({ options }) {
      if (loggedIn.value) {
        options.headers.append(
          "Authorization",
          `Bearer ${session.value?.token}`
        );
      }
    },

    onResponseError({ response }) {
      if (stopIfNotAuth && !loggedIn.value) {
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
