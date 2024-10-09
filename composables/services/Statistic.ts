export const getDayStatistic = async function (
  date: Date | null = null,
  mounted = false
) {
  return CustomHttp<null, DayStatistic>(
    `/statistic/day?date=${date?.toISOString()}`,
    "get",
    null,
    mounted
  );
};
