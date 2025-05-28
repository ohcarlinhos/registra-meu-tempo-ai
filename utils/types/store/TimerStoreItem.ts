export interface TimerStoreItem {
  id: number | null;
  code?: string;

  currentPeriodList: TimePeriodTimer[];
  currentPeriod: TimePeriodTimer;

  isRun: boolean;
  isFetch: boolean;
  interval: NodeJS.Timeout | null;
  intervalSize: number;
  type: TimerTypes;
  count: number;

  showOptions: boolean;
  pomodoroPeriod: number;
  breakPeriod: number;

  page: number;

  localRecords: TimeRecordLocal[];
}
