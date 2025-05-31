// TODO: revisar pois foi feito pela IA
export type WeekStatistic = {
  startWeek: string;
  endWeek: string;
  totalHours: string;
  dailyAverage: string;
  totalSessions: number;
  mostProductiveDay: string;
  leastProductiveDay: string;
  taskDistribution: TaskTimeDistribution[];
  totalRevenue?: number;
  averageRevenue?: number;
  goalProgress: number;
  completedGoals: number;
};

export type TaskTimeDistribution = {
  taskName: string;
  totalTime: string;
  percentage: number;
  sessionCount: number;
  timeRecordId?: string;
};

export type CommonTask = {
  id: string;
  name: string;
  totalTime: string;
  weeklyTime: string;
  averageSessionTime: string;
  frequency: number;
  lastUsed: string;
  category?: string;
};

export type DashboardMetrics = {
  weeklyStats: WeekStatistic;
  commonTasks: TaskTimeDistribution[];
  recentActivity: {
    totalHours: string;
    sessionsToday: number;
    avgSessionLength: string;
  };
  productivity: {
    focusScore: number;
    efficiency: number;
    consistency: number;
  };
};
