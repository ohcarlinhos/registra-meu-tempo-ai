export const getTimePeriods = async function (
  timeRecordId: number,
  page = 1,
  perPage = 4,
  mounted = false
) {
  return await CustomHttp<null, Pagination<TimePeriodType>>(
    `/time-period/${timeRecordId}?page=${page}&perPage=${perPage}`,
    "get",
    null,
    mounted
  );
};

type PayloadPost = {
  timeRecordId: number;
  start: Date;
  end: Date;
};

export const postTimePeriod = async (payload: PayloadPost) => {
  return CustomHttp<PayloadPost, TimeRecordType>(
    "/time-period",
    "post",
    payload,
    true
  );
};

export const putTimePeriod = async (id: number, payload: PayloadPost) => {
  return CustomHttp<PayloadPost, TimeRecordType>(
    `/time-period/${id}`,
    "put",
    payload,
    true
  );
};

export const deleteTimePeriod = async (id: number) => {
  return CustomHttp<PayloadPost, TimeRecordType>(
    `/time-period/${id}`,
    "delete",
    null,
    true
  );
};
