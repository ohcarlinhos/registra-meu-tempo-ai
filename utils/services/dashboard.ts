// TODO: revisar pois foi feito pela IA

export const getWeekStatistic = async (
  start: string,
  end: string
): Promise<RangeStatisticsWithDays> => {
  return useCustomFetch()<RangeStatisticsWithDays>(
    `/statistics/range?start=${start}&end=${end}`
  );
};

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const { data } = await $fetch<{ data: DashboardMetrics }>(
    "/api/dashboard/metrics"
  );
  return data;
};

export const getCommonTasks = async (
  limit: number = 10
): Promise<CommonTask[]> => {
  const { data } = await $fetch<{ data: CommonTask[] }>(
    `/api/tasks/common?limit=${limit}`
  );
  return data;
};

export const getRevenueStatistics = async (
  period: "week" | "month" | "year" = "week"
): Promise<{
  totalRevenue: number;
  averageRevenue: number;
  period: string;
}> => {
  const { data } = await $fetch<{ data: any }>(
    `/api/revenue/statistics?period=${period}`
  );
  return data;
};
