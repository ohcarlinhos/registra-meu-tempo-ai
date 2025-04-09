export const timeMinuteApi = () => ({
  delete: async (id: number) => {
    return useCustomFetch(false)<boolean>(`/minute/${id}`, {
      method: "DELETE",
    });
  },
});
