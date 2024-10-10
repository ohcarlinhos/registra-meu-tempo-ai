export type HistoryPeriodDayMap = {
  date: string;
  count: number;
  timePeriods: TimePeriodMap[];
  timePeriodsFormattedTime: string;
  timerSessions: TimerSessionMap[];
  timerSessionsFormattedTime: string;
  formattedTime: string;
};
