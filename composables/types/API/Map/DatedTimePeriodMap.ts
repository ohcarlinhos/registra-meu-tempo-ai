export type DatedTimePeriodMap = {
  date: string;
  count: number;
  timePeriods: TimePeriodMap[];
  timePeriodsFormattedTime: string;
  timerSessions: TimerSessionsMap[];
  timerSessionsFormattedTime: string;
  formattedTime: string;
};

export type TimerSessionsMap = {
  id: number;
  type: string;
  timePeriods: TimePeriodMap[];
  formattedTime: string;
};
