export const getTimePeriod = async (
  timeRecordId: number,
  pagQuery: IPaginationQuery
) => {
  return useCustomFetch()<Pagination<TimePeriodMap>>(
    `/periods/${timeRecordId}?page=${pagQuery.page}&perPage=${pagQuery.perPage}`,
    { method: "GET" }
  );
};

export const postTimePeriod = async (body: TimePeriodDto) => {
  return useCustomFetch(false)<TimePeriodMap>("/periods", {
    method: "POST",
    body,
  });
};

export const postTimePeriodList = async (
  timeRecordId: number,
  body: TimePeriodListDto
) => {
  return useCustomFetch(false)<TimePeriodDto[]>(
    `/periods/list/${timeRecordId}`,
    {
      method: "POST",
      body,
    }
  );
};

export const putTimePeriod = async (id: number, body: TimePeriodDto) => {
  return useCustomFetch(false)<TimePeriodMap>(`/periods/${id}`, {
    method: "PUT",
    body,
  });
};

export const deleteTimePeriod = async (id: number) => {
  return useCustomFetch(false)<boolean>(`/periods/${id}`, {
    method: "DELETE",
  });
};
