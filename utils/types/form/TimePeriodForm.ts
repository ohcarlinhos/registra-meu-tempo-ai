export type TimePeriodForm = {
  id?: number;
  start: Date | string;
  end: Date | string;
  timeRecordId: number;
  callback?: () => void;
};
