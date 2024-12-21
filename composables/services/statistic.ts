export const getDayStatistic = async (date: Date | null = null) => {
  return useCustomFetch()<DayStatistic>(
    `/statistic/day?date=${date?.toISOString()}`,
    { method: "GET" }
  );
};
