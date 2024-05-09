type Payload = {
  timeRecordId: number;
  start: Date;
  end: Date;
};

export const getTimePeriods = async function (
  timeRecordId: number,
  page = 1,
  perPage = 4
) {
  return await CustomHttp<null, Pagination<TimePeriodType>>(
    `/time-period/${timeRecordId}?page=${page}&perPage=${perPage}`,
    "get"
  );
};
export const postTimePeriod = async (payload: Payload) => {
  return CustomHttp<Payload, TimeRecordType>("/time-period", "post", payload);
};
