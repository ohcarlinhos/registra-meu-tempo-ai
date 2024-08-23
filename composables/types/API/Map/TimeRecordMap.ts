export type TimeRecordMap = {
  id: number;
  title: string;
  description: string;
  userId: number;
  categoryName: string | null;
  categoryId: number | null;
  code: string;
  timePeriods: TimePeriodMap[];
  timeRecordDate: string | null;
  formattedTime: string;
  timeTotalMilliseconds: number;
  timePeriodsCount: number;
  externalLink: string;
};
