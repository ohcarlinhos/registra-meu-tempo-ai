import type { Notification } from "#ui/types";

export const ErrorHandleMessage = (error: unknown): Partial<Notification> => {
  const e = error as Error;
  if (e.message) return { title: e.message, color: "red" };
  return { title: "Erro", color: "red" };
};
