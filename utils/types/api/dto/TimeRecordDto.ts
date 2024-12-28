export type CreateTimeRecordDto = {
  description: string;
  timePeriods: { start: Date | string; end: Date | string }[];
  categoryId?: number | null;
  code?: string;
  timerSessionType?: string;
  timerSessionFrom?: string;
};

export type UpdateTimeRecordDto = {
  id: number;
  description: string;
  categoryId?: number | null;
  externalLink?: string;
  code?: string;
};
