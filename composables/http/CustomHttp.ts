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

const clearSession = (is$Fetch = false) => {
  useAuthStore().clearUserToken();
  useAuthStore().openModal(!is$Fetch);

  if (is$Fetch) {
    throw new Error(useNuxtApp().$i18n.t("sessionExpiredError"));
  }

  return null;
};

const emitGenericError = () => {
  throw new Error(useNuxtApp().$i18n.t("apiGenericError"));
};

export const CustomHttp = async <P, R>(
  route: string,
  method: MethodType = "get",
  payload: P | null = null,
  is$Fetch = false,
  stopIfNotAuth = true
) => {
  const cs = useConfigStore();
  const authorization = `Bearer ${useAuthStore().getUserToken}`;

  if (!cs.apiBase) {
    throw new Error(useNuxtApp().$i18n.t("sessionExpiredError"));
  }

  if (stopIfNotAuth && !useAuthStore().isAuth) {
    return clearSession(is$Fetch);
  }

  if (!is$Fetch) {
    const { data, error } = await useFetch<R>(route, {
      key: `request:${route}`,
      retry: false,
      immediate: true,
      baseURL: cs.apiBase,
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
  } else {
    try {
      const data = await $fetch<R>(route, {
        retry: false,
        baseURL: cs.apiBase,
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

      if (err.status === 401) return clearSession(is$Fetch);

      if (err && err.data && err.data.message)
        throw new Error(err.data.message);

      emitGenericError();
    }
  }
};
