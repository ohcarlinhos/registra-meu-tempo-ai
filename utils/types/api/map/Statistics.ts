export type RangeStatistic = {
  startDay: string;
  endDay: string;

  totalHours: string;
  isolatedPeriodHours: string;
  timerHours: string;
  pomodoroHours: string;
  timeManualHours: string;

  breakHours: string;

  timerCount: number;
  pomodoroCount: number;
  breakCount: number;
  sessionCount: number;
  timePeriodCount: number;
  isolatedPeriodCount: number;
  manualCount: number;

  totalInHours: number;
  totalInMinutes: number;

  averageHours: string;
  daysCount: number;
  activeDaysCount: number;
  averageInHours: number;
  averageInMinutes: number;

  timeRecordRangeProgress: TimeRecordRangeProgress[] | null;
};

export type TimeRecordRangeProgress = {
  totalHours: string;
  timeRecord: TimeRecordMap;
};

export type RangeStatisticsWithDays = {
  total: RangeStatistic;
  days: RangeStatistic[];
};
