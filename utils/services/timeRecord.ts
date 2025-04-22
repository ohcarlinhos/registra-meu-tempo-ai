export const getTimeRecords = async (pagQuery: IPaginationQuery) => {
  return useCustomFetch()<Pagination<TimeRecordMap>>(
    `/records${paginationQueryHandle(pagQuery)}`,
    { method: "GET" }
  );
};

export const searchTimeRecord = async (search: string = "") => {
  return useCustomFetch()<SearchTimeRecordItem[]>(
    `/records/search?value=${search}`,
    { method: "GET" }
  );
};

export const getTimeRecordByCode = async (code: string) => {
  return useCustomFetch()<TimeRecordMap>(`/records/${code}`, {
    method: "GET",
  });
};

export const postTimeRecord = async (body: CreateTimeRecordDto) => {
  return useCustomFetch(false)<TimeRecordMap>("/records", {
    method: "POST",
    body,
  });
};

export const putTimeRecord = async (body: UpdateTimeRecordDto) => {
  return useCustomFetch(false)<TimeRecordMap>(`/records/${body.id}`, {
    method: "PUT",
    body,
  });
};

export const deleteTimeRecord = async (id: number) => {
  return useCustomFetch(false)<boolean>(`/records/${id}`, { method: "DELETE" });
};

export const timeRecordApi = () => ({
  get: async (pagQuery: IPaginationQuery) => {
    return useCustomFetch()<Pagination<TimeRecordMap>>(
      `/records${paginationQueryHandle(pagQuery)}`,
      { method: "GET" }
    );
  },
  delete: async (id: number) => {
    return useCustomFetch(false)<boolean>(`/records/${id}`, {
      method: "DELETE",
    });
  },
  getHistory: async (pagQuery: IPaginationQuery, timeRecordId: number) => {
    return useCustomFetch()<Pagination<TimeRecordHistoryDayMap>>(
      `/records/history/${timeRecordId}${paginationQueryHandle(pagQuery)}`,
      {
        method: "GET",
      }
    );
  },
});
