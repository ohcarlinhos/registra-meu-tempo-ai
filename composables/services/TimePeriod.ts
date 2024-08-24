export const getTimePeriods = async function (
  timeRecordId: number,
  page = 1,
  perPage = 4,
  mounted = false
) {
  return await CustomHttp<null, Pagination<TimePeriodMap>>(
    `/time-period/${timeRecordId}?page=${page}&perPage=${perPage}`,
    "get",
    null,
    mounted
  );
};

export const postTimePeriod = async (payload: TimePeriodDto) => {
  return CustomHttp<TimePeriodDto, TimeRecordMap>(
    "/time-period",
    "post",
    payload,
    true
  );
};

export const postTimePeriodList = async (
  payload: TimePeriodListDto,
  timeRecordId: number
) => {
  return CustomHttp<TimePeriodListDto, TimeRecordMap>(
    `/time-period/list/${timeRecordId}`,
    "post",
    payload,
    true
  );
};

export const putTimePeriod = async (id: number, payload: TimePeriodDto) => {
  return CustomHttp<TimePeriodDto, TimeRecordMap>(
    `/time-period/${id}`,
    "put",
    payload,
    true
  );
};

export const deleteTimePeriod = async (id: number) => {
  return CustomHttp<null, boolean>(`/time-period/${id}`, "delete", null, true);
};
