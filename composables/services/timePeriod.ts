export const getTimePeriods = async (
  timeRecordId: number,
  pagQuery: IPaginationQuery
) => {
  return useCustomFetch()<Pagination<TimePeriodMap>>(
    `/period/${timeRecordId}?page=${pagQuery.page}&perPage=${pagQuery.perPage}`,
    { method: "GET" }
  );
};

export const postTimePeriod = async (body: TimePeriodDto) => {
  return useCustomFetch(false)<TimePeriodMap>("/period", {
    method: "POST",
    body,
  });
};

export const postTimePeriodList = async (
  timeRecordId: number,
  body: TimePeriodListDto
) => {
  return useCustomFetch(false)<TimePeriodDto[]>(
    `/period/list/${timeRecordId}`,
    {
      method: "POST",
      body,
    }
  );
};

export const putTimePeriod = async (id: number, body: TimePeriodDto) => {
  return useCustomFetch(false)<TimePeriodMap>(`/period/${id}`, {
    method: "PUT",
    body,
  });
};

export const deleteTimePeriod = async (id: number) => {
  return useCustomFetch(false)<boolean>(`/period/${id}`, {
    method: "DELETE",
  });
};
