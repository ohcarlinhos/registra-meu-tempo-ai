import type { Categoria } from "~/classes/Categoria";

export const getCategorias = async function () {
  const { data, error } = await useAsyncData("focus", () =>
    $fetch("/categoria", {
      retry: false,
      baseURL: useRuntimeConfig().public.apiBase,
      method: "get",
      headers: {
        Authorization: `Bearer ${useAuthStore().getUserToken}`,
      },
    })
  );

  if (error.value) throw (error.value.data as { message: string }).message;
  return data.value as Categoria[];
};
