// TODO: revisar pois foi feito pela IA
import type {
  WeekStatistic,
  DashboardMetrics,
  CommonTask,
} from "~/utils/types/api/map/WeekStatistic";

export const getWeekStatistic = async (
  week?: string
): Promise<WeekStatistic> => {
  const params = week ? `?week=${week}` : "";
  const { data } = await $fetch<{ data: WeekStatistic }>(
    `/api/statistics/week${params}`
  );
  return data;
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
