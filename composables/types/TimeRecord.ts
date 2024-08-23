export type TimeRecordType = {
  title: string;
  description: string;
  timeRecordDate: string | null;
  timePeriods: TimePeriodMap[];
  id?: number;
  categoryId?: number | null;
  categoryName?: string;
  code?: string;
  formattedTime?: string;
  timeTotalMilliseconds?: number;
  timePeriodsCount?: number;
  externalLink?: string;
};

export interface ITimeRecordLocal extends TimeRecordType {
  localUuid: string;
}

export interface ITimeRecordTable extends TimeRecordType {
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
