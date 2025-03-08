export const getTimeRecords = async (pagQuery: IPaginationQuery) => {
  return useCustomFetch()<Pagination<TimeRecordMap>>(
    `/record${paginationQueryHandle(pagQuery)}`,
    { method: "GET" }
  );
};

export const searchTimeRecord = async (search: string = "") => {
  return useCustomFetch()<SearchTimeRecordItem[]>(
    `/record/search?value=${search}`,
    { method: "GET" }
  );
};

export const getTimeRecordByCode = async (code: string) => {
  return useCustomFetch()<TimeRecordMap>(`/record/${code}`, {
    method: "GET",
  });
};

export const postTimeRecord = async (body: CreateTimeRecordDto) => {
  if (body.categoryId == null) delete body.categoryId;

  return useCustomFetch(false)<TimeRecordMap>("/record", {
    method: "POST",
    body,
  });
};

export const putTimeRecord = async (body: UpdateTimeRecordDto) => {
  if (body.categoryId == null) delete body.categoryId;

  return useCustomFetch(false)<TimeRecordMap>(`/record/${body.id}`, {
    method: "PUT",
    body,
  });
};

export const deleteTimeRecord = async (id: number) => {
  return useCustomFetch(false)<boolean>(`/record/${id}`, { method: "DELETE" });
};

export const timeRecordApi = () => ({
  get: async (pagQuery: IPaginationQuery) => {
    return useCustomFetch()<Pagination<TimeRecordMap>>(
      `/record${paginationQueryHandle(pagQuery)}`,
      { method: "GET" }
    );
  },
  delete: async (id: number) => {
    return useCustomFetch(false)<boolean>(`/record/${id}`, {
      method: "DELETE",
    });
  },
  getHistory: async (pagQuery: IPaginationQuery, timeRecordId: number) => {
    return useCustomFetch()<Pagination<TimeRecordHistoryDayMap>>(
      `/record/history/${timeRecordId}${paginationQueryHandle(pagQuery)}`,
      {
        method: "GET",
      }
    );
  },
});
