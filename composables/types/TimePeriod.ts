export type TimePeriodType = {
  id?: number;
  timeRecordId?: number;
  formattedTime?: string;
  start: Date;
  end: Date;
};

export type TimePeriodFormType = {
  id?: number;
  start: Date | string;
  end: Date | string;
  timeRecordId: number;
  callback?: () => void;
};
