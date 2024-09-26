import type { Notification } from "#ui/types";

export const MessageErrorHandle = (error: unknown): Partial<Notification> => {
  const t = useNuxtApp().$i18n.t;

  if (typeof error == "string") {
    const translate = TranslateErrorHandle(error);
    return {
      title: translate ? t(translate) : error,
      color: "red",
    };
  }

  const e = error as Error;

  if (e.message) {
    const translate = TranslateErrorHandle(e.message);
    return { title: translate ? t(translate) : e.message, color: "red" };
  }

  return { title: t("genericError"), color: "red" };
};
