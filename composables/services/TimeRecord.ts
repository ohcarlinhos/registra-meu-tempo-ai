export const getTimeRecords = async function (
  pagQuery: IPaginationQuery,
  mounted = false
) {
  return await CustomHttp<null, Pagination<TimeRecordMap>>(
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
  return await CustomHttp<null, TimeRecordMap>(
    `/time-record/${code}`,
    "get",
    null,
    mounted
  );
};

export const deleteTimeRecord = async (id: number) => {
  return await CustomHttp<null, boolean>(
    `/time-record/${id}`,
    "delete",
    null,
    true
  );
};

export const postTimeRecord = async (payload: CreateTimeRecordDto) => {
  if (payload.categoryId == null) delete payload.categoryId;

  return CustomHttp<CreateTimeRecordDto, TimeRecordMap>(
    "/time-record",
    "post",
    payload,
    true
  );
};

export const putTimeRecord = async (payload: UpdateTimeRecordDto) => {
  if (payload.categoryId == null) delete payload.categoryId;

  return CustomHttp<UpdateTimeRecordDto, TimeRecordMap>(
    `/time-record/${payload.id}`,
    "put",
    payload,
    true
  );
};
