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
  payload: P | null = null
) => {
  const opts: { body?: object } = {};
  if (!!payload) opts.body = payload;

  const { data, error } = await useAsyncData("focus", () =>
    $fetch(route, {
      retry: false,
      baseURL: useRuntimeConfig().public.apiBase,
      method,
      headers: {
        Authorization: `Bearer ${useAuthStore().getUserToken}`,
      },
      ...opts,
    })
  );

  if (error.value) {
    const { data } = error.value;
    const err = data as { message?: string; title?: string };
    if (err.message) {
      throw err.message;
    } else if (err.title) {
      throw err.title;
    } else {
      throw "Erro no servidor.";
    }
  }

  return data as Ref<R>;
};
