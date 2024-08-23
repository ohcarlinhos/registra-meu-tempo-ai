export interface TimeRecordTimer {
  id?: number;
  code?: string;
  localUuid: string;
  title: string;
  description: string;
  timeRecordDate: string;
  timePeriods: TimePeriodTimer[];
}

export type TimePeriodTimer = {
  start: Date;
  end: Date;
};

export interface ITimeRecordTable extends TimeRecordMap {
  timePeriodsCountText?: string;
}

export type TimeRecordFormType = {
  id?: number;
  title: string;
  description: string;
  category: string;
  categoryId?: number | null;
  code: string;
  externalLink?: string;
  timePeriods: { start: Date | string; end: Date | string }[];
  isSync?: boolean;
  callback?: (code?: string) => void;
};
