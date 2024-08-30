import type { Notification } from "#ui/types";

export const ErrorHandleMessage = (error: unknown): Partial<Notification> => {
  if (typeof error == "string") return { title: error, color: "red" };

  const e = error as Error;
  if (e.message) return { title: e.message, color: "red" };

  return { title: "Não foi possível executar essa ação.", color: "red" };
};
