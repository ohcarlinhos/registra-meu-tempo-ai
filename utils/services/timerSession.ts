export const deleteTimerSession = async (id: number) => {
  return useCustomFetch(false)<boolean>(`/sessions/${id}`, {
    method: "DELETE",
  });
};
