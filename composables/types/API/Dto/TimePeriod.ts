export type TimePeriodDto = {
  timeRecordId: number;
  start: Date;
  end: Date;
};

export type TimePeriodListDto = {
  type: string;
  from: string;
  timePeriods: { start: Date; end: Date }[];
};
