export type Pagination<T> = {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  search: string;
  data: T[];
};
