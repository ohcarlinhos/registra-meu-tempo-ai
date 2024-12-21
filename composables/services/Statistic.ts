export const getDayStatistic = async (date: Date | null = null) => {
  return useCustomFetch(true, false)<DayStatistic>(
    `/statistic/day?date=${date?.toISOString()}`,
    { method: "GET" }
  );
};
