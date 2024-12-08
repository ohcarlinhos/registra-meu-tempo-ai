type MethodType =
  | "get"
  | "head"
  | "patch"
  | "post"
  | "put"
  | "delete"
  | "connect"
  | "options"
  | "trace";

const clearSession = (needUse$Fetch = false) => {
  useAuthStoreV2().clearUserToken();
  useAuthStoreV2().openAuthModal(!needUse$Fetch);

  if (needUse$Fetch) {
    throw new Error(useNuxtApp().$i18n.t("sessionExpiredError"));
  }

  return null;
};

const clearSessionV2 = (needRefresh = false) => {
  const { clearUserToken, openAuthModal } = useAuthStoreV2();
  const { $i18n } = useNuxtApp();

  clearUserToken();
  openAuthModal(needRefresh);

  throw new Error($i18n.t("sessionExpiredError"));
};

const emitGenericError = () => {
  throw new Error(useNuxtApp().$i18n.t("apiGenericError"));
};

const CustomHttpUsingFetch = async <P, R>(
  route: string,
  method: MethodType = "get",
  payload: P | null = null,
  authorization: string
) => {
  const configStore = useConfigStore();

  const { data, error } = await useFetch<R>(route, {
    key: `request:${route}`,
    retry: false,
    immediate: true,
    baseURL: configStore.apiBase,
    onRequest({ options }) {
      options.method = method;
    },
    headers: {
      Authorization: authorization,
    },
    body: payload || undefined,
  });

  if (error.value) {
    if (error.value.statusCode === 401) return clearSession();

    const err = error.value.data as { message?: string; title?: string };
    if (err && err.message) throw new Error(err.message);

    emitGenericError();
  }

  return data.value as R;
};

const CustomHttpUsing$Fetch = async <P, R>(
  route: string,
  method: MethodType = "get",
  payload: P | null = null,
  authorization: string
) => {
  const configStore = useConfigStore();

  try {
    const data = await $fetch<R>(route, {
      retry: false,
      baseURL: configStore.apiBase,
      method: method,
      headers: {
        Authorization: authorization,
      },
      body: payload || undefined,
    });

    return data as R;
  } catch (error) {
    const err = error as {
      data: { message?: string; title?: string };
      status: number;
    };

    if (err.status === 401) return clearSession(true);

    if (err && err.data && err.data.message) throw new Error(err.data.message);

    emitGenericError();

    return null;
  }
};

export const CustomHttp = async <P, R>(
  route: string,
  method: MethodType = "get",
  payload: P | null = null,
  needUse$Fetch = false,
  stopIfNotAuth = true
) => {
  const configStore = useConfigStore();
  const authorization = `Bearer ${
    storeToRefs(useAuthStoreV2()).userToken.value
  }`;

  if (!configStore.apiBase) {
    throw new Error(useNuxtApp().$i18n.t("sessionExpiredError"));
  }

  if (stopIfNotAuth && !storeToRefs(useAuthStoreV2()).isAuth.value) {
    return clearSession(needUse$Fetch);
  }

  if (needUse$Fetch) {
    return CustomHttpUsing$Fetch<P, R>(route, method, payload, authorization);
  }

  return CustomHttpUsingFetch<P, R>(route, method, payload, authorization);
};

export const useCustomFetch = (needRefresh = false, stopIfNotAuth = true) => {
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
        clearSessionV2(needRefresh);
        return;
      }

      if (response?.status === 401) {
        clearSessionV2(needRefresh);
        return;
      }

      if (response?._data.message) {
        throw new Error(response?._data.message);
      }

      throw new Error($i18n.t("apiGenericError"));
    },
  });
};
