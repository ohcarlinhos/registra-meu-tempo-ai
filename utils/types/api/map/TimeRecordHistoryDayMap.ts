export type TimeRecordHistoryDayMap = {
  date: string;
  count: number;
  timePeriods: TimePeriodMap[];
  timePeriodsFormattedTime: string;
  timerSessions: TimerSessionMap[];
  timerSessionsFormattedTime: string;
  timeMinutes: TimeMinutesMap[];
  timeMinutesFormattedTime: string;
  timeInMinutes: number;
  timeInHours: number;
  formattedTime: string;
};

export type TimeRecordHistoryDayChart = {
  date: string;
  timeInMinutes: number;
  timeInHours: number;
  formattedTime: string;
};
