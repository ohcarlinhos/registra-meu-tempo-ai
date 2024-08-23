export type TimePeriodFormType = {
  id?: number;
  start: Date | string;
  end: Date | string;
  timeRecordId: number;
  callback?: () => void;
};
