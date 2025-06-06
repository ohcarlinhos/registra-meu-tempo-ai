export const getRangeStatistic = async (
  date: Date | null = null,
  timeRecordId: number | undefined = undefined
) => {
  return useCustomFetch()<RangeStatistic>(
    `/statistics${
      timeRecordId ? "/" + timeRecordId : ""
    }/day?date=${date?.toISOString()}`,
    { method: "GET" }
  );
};
