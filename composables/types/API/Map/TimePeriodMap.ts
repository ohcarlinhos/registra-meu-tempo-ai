export type TimePeriodMap = {
  id: number;
  timeRecordId: number;
  start: string;
  end: string;
  time: {
    seconds: string;
    minutes: string;
    hours: string;
    days: string;
  };
  formattedTime: string;
};
