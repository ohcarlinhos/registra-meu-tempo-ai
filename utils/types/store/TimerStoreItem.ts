export interface TimerStoreItem {
  id: number | null;
  code?: string;

  currentPeriodList: TimePeriodTimer[];
  currentPeriod: TimePeriodTimer;

  isRun: boolean;
  isFetch: boolean;
  interval: NodeJS.Timeout | null;
  type: TimerTypes;

  showOptions: boolean;
  pomodoroPeriod: number;
  breakPeriod: number;

  page: number;

  localRecords: TimeRecordLocal[];
}
