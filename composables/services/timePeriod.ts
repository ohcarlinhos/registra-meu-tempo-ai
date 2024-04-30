type Payload = {
  timeRecordId: number;
  start: Date;
  end: Date;
};

export const getTimePeriods = async function (timeRecordId: number) {
  return await CustomHttp<null, TimePeriodType[]>(
    `/time-period/${timeRecordId}`,
    "get"
  );
};
export const postTimePeriod = async (payload: Payload) => {
  return CustomHttp<Payload, TimeRecordType>("/time-period", "post", payload);
};
