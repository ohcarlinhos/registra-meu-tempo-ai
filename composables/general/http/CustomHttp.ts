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

export const CustomHttp = async <P, R>(
  route: string,
  method: MethodType = "get",
  payload: P | null = null,
  is$fetch = false
) => {
  if (!is$fetch) {
    const { data, error } = await useFetch<R>(route, {
      key: `request:${route}`,
      retry: false,
      immediate: true,
      baseURL: useRuntimeConfig().public.apiBase,
      onRequest({ options }) {
        options.method = method;
      },
      headers: {
        Authorization: `Bearer ${useAuthStore().getUserToken}`,
      },
      body: payload || undefined,
    });

    if (error.value) {
      const err = error.value.data as { message?: string; title?: string };

      if (err && err.message) throw new Error(err.message);

      throw new Error(
        "Não foi possível realizar essa ação, espere alguns minutos e tente novamente."
      );
    }

    return data.value;
  } else {
    // TODO: remover duplicação
    try {
      const data = await $fetch<R>(route, {
        retry: false,
        baseURL: useRuntimeConfig().public.apiBase,
        method: method,
        headers: {
          Authorization: `Bearer ${useAuthStore().getUserToken}`,
        },
        body: payload || undefined,
      });

      return data;
    } catch (error) {
      const err = error as { data: { message?: string; title?: string } };

      if (err && err.data.message) throw new Error(err.data.message);

      throw new Error(
        "Não foi possível realizar essa ação, espere alguns minutos e tente novamente."
      );
    }
  }
};
