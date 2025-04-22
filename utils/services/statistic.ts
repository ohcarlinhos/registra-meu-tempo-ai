export const getDayStatistic = async (
  date: Date | null = null,
  timeRecordId: number | undefined = undefined
) => {
  return useCustomFetch()<DayStatistic>(
    `/statistics${
      timeRecordId ? "/" + timeRecordId : ""
    }/day?date=${date?.toISOString()}`,
    { method: "GET" }
  );
};
