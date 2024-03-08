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
  const { data, error } = await useAsyncData("focus", () =>
    $fetch(route, {
      retry: false,
      baseURL: useRuntimeConfig().public.apiBase,
      method,
      headers: {
        Authorization: `Bearer ${useAuthStore().getUserToken}`,
      },
      body: payload || undefined,
    })
  );

  if (error.value) {
    const err = error.value.data as { message?: string; title?: string };

    if (err && err.message) throw new Error(err.message);

    throw new Error(
      "Não foi possível realizar essa ação, espere alguns minutos e tente novamente."
    );
  }

  return data as Ref<R>;
};
