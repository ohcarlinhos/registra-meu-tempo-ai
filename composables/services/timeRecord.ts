export const getTimeRecords = async function (page = 1, perPage = 8) {
  return await CustomHttp<null, Pagination<TimeRecordType>>(
    `/time-record?page=${page}&perPage=${perPage}`,
    "get"
  );
};

export const getTimeRecordById = async function (id: number) {
  return await CustomHttp<null, TimeRecordType>(`/time-record/${id}`, "get");
};

export const deleteTimeRecord = async (id: number) => {
  return await CustomHttp<null, TimeRecordType>(`/time-record/${id}`, "delete");
};

type Payload = {
  description: string;
  timePeriods: { start: Date | string; end: Date | string }[];
  categoryId?: number | null;
};

export const postTimeRecord = async (payload: Payload) => {
  if (payload.categoryId == null) delete payload.categoryId;

  return CustomHttp<Payload, TimeRecordType>("/time-record", "post", payload);
};
