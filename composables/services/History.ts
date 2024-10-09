export const getPeriodHistory = async function (
  timeRecordId: number,
  mounted = false
) {
  return await CustomHttp<null, HistoryDayMap[]>(
    `/period/history/${timeRecordId}`,
    "get",
    null,
    mounted
  );
};
