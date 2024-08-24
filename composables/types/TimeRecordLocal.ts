export interface TimeRecordLocal {
  id?: number;
  code?: string;
  localUuid: string;
  title: string;
  description: string;
  timeRecordDate: string;
  timePeriods: TimePeriodLocal[];
}

export type TimePeriodLocal = {
  start: Date;
  end: Date;
};
