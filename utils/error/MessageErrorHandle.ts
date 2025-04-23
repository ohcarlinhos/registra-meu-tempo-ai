import type { Toast } from "~/components/ui/toast/use-toast";

export const MessageErrorHandle = (error: unknown): Toast => {
  const t = useNuxtApp().$i18n.t;

  if (typeof error == "string") {
    const translate = TranslateErrorHandle(error);
    return {
      description: translate ? t(translate) : error,
      variant: "destructive",
    };
  }

  const e = error as Error;

  if (e.message) {
    const translate = TranslateErrorHandle(e.message);
    return {
      description: translate ? t(translate) : e.message,
      variant: "destructive",
    };
  }

  return {
    description: t("genericError"),
    variant: "destructive",
  };
};
