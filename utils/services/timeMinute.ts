export const timeMinuteApi = () => ({
  delete: async (id: number) => {
    return useCustomFetch(false)<boolean>(`/minutes/${id}`, {
      method: "DELETE",
    });
  },
  post: async (dto: CreateTimeMinuteListDto, timeRecordId: number) => {
    return useCustomFetch(false)<boolean>(`/minutes/list/${timeRecordId}`, {
      method: "POST",
      body: dto,
    });
  },
});
