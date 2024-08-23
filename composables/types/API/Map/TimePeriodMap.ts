export type TimePeriodMap = {
  id: number;
  timeRecordId: number;
  start: Date;
  end: Date;
  time: {
    seconds: string;
    minutes: string;
    hours: string;
    days: string;
  };
  formattedTime: string;
};
