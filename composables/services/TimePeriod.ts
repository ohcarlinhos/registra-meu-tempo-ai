export const getTimePeriods = async function (
  timeRecordId: number,
  pagQuery: IPaginationQuery,
  mounted = false
) {
  return await CustomHttp<null, Pagination<TimePeriodMap>>(
    `/time-period/${timeRecordId}?page=${pagQuery.page}&perPage=${pagQuery.perPage}`,
    "get",
    null,
    mounted
  );
};

export const getDatedTimePeriod = async function (
  timeRecordId: number,
  pagQuery: IPaginationQuery,
  mounted = false
) {
  return await CustomHttp<null, Pagination<DatedTimePeriodMap>>(
    `/time-period/dated/${timeRecordId}?page=${pagQuery.page}&perPage=${pagQuery.perPage}`,
    "get",
    null,
    mounted
  );
};

export const postTimePeriod = async (payload: TimePeriodDto) => {
  return CustomHttp<TimePeriodDto, TimePeriodMap>(
    "/time-period",
    "post",
    payload,
    true
  );
};

export const postTimePeriodList = async (
  timeRecordId: number,
  payload: TimePeriodListDto
) => {
  return CustomHttp<TimePeriodListDto, TimePeriodDto[]>(
    `/time-period/list/${timeRecordId}`,
    "post",
    payload,
    true
  );
};

export const putTimePeriod = async (id: number, payload: TimePeriodDto) => {
  return CustomHttp<TimePeriodDto, TimePeriodDto>(
    `/time-period/${id}`,
    "put",
    payload,
    true
  );
};

export const deleteTimePeriod = async (id: number) => {
  return CustomHttp<null, boolean>(`/time-period/${id}`, "delete", null, true);
};
