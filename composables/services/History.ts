export const getPeriodHistoryDay = async function (
  pagQuery: IPaginationQuery,
  timeRecordId: number,
  mounted = false
) {
  return await CustomHttp<null, Pagination<HistoryDayMap>>(
    `/period/history/${timeRecordId}${paginationQueryHandle(pagQuery)}`,
    "get",
    null,
    mounted
  );
};
