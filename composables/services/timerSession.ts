export const deleteTimerSession = async (id: number) => {
  return useCustomFetch(false)<boolean>(`/session/${id}`, {
    method: "DELETE",
  });
};
