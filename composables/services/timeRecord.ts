export const getTimeRecords = async function (
  pagQuery: IPaginationQuery,
  mounted = false
) {
  return await CustomHttp<null, Pagination<TimeRecordType>>(
    `/time-record?page=${pagQuery.page}&perPage=${pagQuery.perPage}&search=${pagQuery.search}`,
    "get",
    null,
    mounted
  );
};

export const getTimeRecordByCode = async function (
  code: string,
  mounted = false
) {
  return await CustomHttp<null, TimeRecordType>(
    `/time-record/${code}`,
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

type PayloadPut = {
  id: number;
  description: string;
  // timePeriods?: { start: Date | string; end: Date | string }[];
  categoryId?: number | null;
  externalLink?: string;
  code?: string;
};

export const putTimeRecord = async (payload: PayloadPut) => {
  if (payload.categoryId == null) delete payload.categoryId;

  return CustomHttp<PayloadPut, TimeRecordType>(
    `/time-record/${payload.id}`,
    "put",
    payload,
    true
  );
};
