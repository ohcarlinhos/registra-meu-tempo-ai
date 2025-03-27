export interface TimeRecordSharedDto {
  title?: string;
  description?: string;
  code?: string;
  categoryId?: number | null;
  externalLink?: string;
  timerSessionType?: string;
  timerSessionFrom?: string;
}

export interface CreateTimeRecordDto extends TimeRecordSharedDto {
  timePeriods: { start: Date | string; end: Date | string }[];
}

export interface UpdateTimeRecordDto extends TimeRecordSharedDto {
  id: number;
}
