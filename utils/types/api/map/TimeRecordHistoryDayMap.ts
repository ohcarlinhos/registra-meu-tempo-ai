export type TimeRecordHistoryDayMap = {
  date: string;
  count: number;
  timePeriods: TimePeriodMap[];
  timePeriodsFormattedTime: string;
  timerSessions: TimerSessionMap[];
  timerSessionsFormattedTime: string;
  timeMinutes: TimeMinutesMap[];
  timeMinutesFormattedTime: string;
  timeOnMinutes: number;
  timeOnHours: number;
  formattedTime: string;
};

export type TimeRecordHistoryDayChart = {
  date: string;
  timeOnMinutes: number;
  timeOnHours: number;
  formattedTime: string;
};
