export interface TimeRecordLocalTable {
  timeRecordDate: string;
  timePeriods: TimePeriodLocal[];
  formattedTime: string;
  code: string | undefined;
  id: number | null;
  localUuid: string;
  title: string;
  description: string;
  timerSessionType?: string;
  timerSessionFrom?: string;
}
