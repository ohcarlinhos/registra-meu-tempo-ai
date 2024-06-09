export type TimeRecordType = {
  description: string;
  timeRecordDate: string | null;
  timePeriods: TimePeriodType[];
  id?: number;
  categoryId?: number | null;
  categoryName?: string;
  code?: string;
  formattedTime?: string;
  timePeriodsCount?: number;
};

export interface ITimeRecordLocal extends TimeRecordType {
  localUuid: string;
}

export interface ITimeRecordTable extends TimeRecordType {
  timePeriodsCountText?: string;
}

export type TimeRecordFormType = {
  id?: number;
  description: string;
  category: string;
  categoryId?: number;
  code: string;
  timePeriods: { start: Date | string; end: Date | string }[];
  callback?: () => void;
};

