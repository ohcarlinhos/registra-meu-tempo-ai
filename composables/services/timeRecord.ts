export const getTimeRecords = async function (
  page = 1,
  perPage = 8,
  search = "",
  mounted = false
) {
  return await CustomHttp<null, Pagination<TimeRecordType>>(
    `/time-record?page=${page}&perPage=${perPage}&search=${search}`,
    "get",
    null,
    mounted
  );
};

export const getTimeRecordById = async function (id: number, mounted = false) {
  return await CustomHttp<null, TimeRecordType>(
    `/time-record/${id}`,
    "get",
    null,
    mounted
  );
};

export const deleteTimeRecord = async (id: number) => {
  return await CustomHttp<null, TimeRecordType>(
    `/time-record/${id}`,
    "delete",
    null,
    true
  );
};

type PayloadPost = {
  description: string;
  timePeriods: { start: Date | string; end: Date | string }[];
  categoryId?: number | null;
  code?: string;
};

export const postTimeRecord = async (payload: PayloadPost) => {
  if (payload.categoryId == null) delete payload.categoryId;

  return CustomHttp<PayloadPost, TimeRecordType>(
    "/time-record",
    "post",
    payload,
    true
  );
};

