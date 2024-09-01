export type TimeRecordMap = {
  id: number;
  title: string;
  description: string;
  userId: number;
  categoryName: string | null;
  categoryId: number | null;
  code: string;
  externalLink: string;
  meta: TimeRecordMeta | null;
};
