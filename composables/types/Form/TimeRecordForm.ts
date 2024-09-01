export type TimeRecordForm = {
  id?: number;
  title: string;
  description: string;
  category: string;
  categoryId?: number | null;
  code: string;
  externalLink?: string;
  timePeriods: { start: Date | string; end: Date | string }[];
  isSync?: boolean;
  timerSessionType?: string;
  timerSessionFrom?: string;
  callback?: (code?: string) => void;
};
