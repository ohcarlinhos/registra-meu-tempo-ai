export const getPeriodHistoryDay = async function (
  pagQuery: IPaginationQuery,
  timeRecordId: number,
  mounted = false
) {
  return await CustomHttp<null, Pagination<HistoryPeriodDayMap>>(
    `/period/history/${timeRecordId}${paginationQueryHandle(pagQuery)}`,
    "get",
    null,
    mounted
  );
};
