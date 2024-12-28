import type { i18nT } from "~/translate/ptBr";

export const _$t = (key: i18nT) => {
  const { $i18n } = useNuxtApp();
  return $i18n.t(key);
};
