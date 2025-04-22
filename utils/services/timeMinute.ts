export const timeMinuteApi = () => ({
  delete: async (id: number) => {
    return useCustomFetch(false)<boolean>(`/minutes/${id}`, {
      method: "DELETE",
    });
  },
});
