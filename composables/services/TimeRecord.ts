export const getTimeRecords = async function (
  pagQuery: IPaginationQuery,
  mounted = false
) {
  return await CustomHttp<null, Pagination<TimeRecordMap>>(
    `/record${paginationQueryHandle(pagQuery)}`,
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
    `/record/${code}`,
    "get",
    null,
    mounted
  );
};

export const deleteTimeRecord = async (id: number) => {
  return await CustomHttp<null, boolean>(`/record/${id}`, "delete", null, true);
};

export const postTimeRecord = async (payload: CreateTimeRecordDto) => {
  if (payload.categoryId == null) delete payload.categoryId;

  return CustomHttp<CreateTimeRecordDto, TimeRecordMap>(
    "/record",
    "post",
    payload,
    true
  );
};

export const putTimeRecord = async (payload: UpdateTimeRecordDto) => {
  if (payload.categoryId == null) delete payload.categoryId;

  return CustomHttp<UpdateTimeRecordDto, TimeRecordMap>(
    `/record/${payload.id}`,
    "put",
    payload,
    true
  );
};
