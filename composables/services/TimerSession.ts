export const deleteTimerSession = async (id: number) => {
  return CustomHttp<null, boolean>(`/session/${id}`, "delete", null, true);
};
