import { format } from "date-fns";

import type { RegistroDeTempo } from "~/classes/RegistroDeTempo";

export const getRegistrosDeTempo = async function () {
  const { data, error } = await useAsyncData("focus", () =>
    $fetch("/registro-de-tempo", {
      retry: false,
      baseURL: useRuntimeConfig().public.apiBase,
      method: "get",
      headers: {
        Authorization: `Bearer ${useAuthStore().getUserToken}`,
      },
    })
  );

  if (error.value) throw (error.value.data as { message: string }).message;

  const list = toRaw(data.value) as RegistroDeTempo[];

  list.forEach((registro) => {
    registro.dataDoRegistro = format(
      registro.dataDoRegistro,
      "dd/MM/yyyy hh:mm"
    );

    if (!registro.nomeDaCategoria) registro.nomeDaCategoria = "-";
    if (!registro.tempoFormatado) registro.tempoFormatado = "Nenhum";
  });

  return list;
};
