export type Pagination<T> = {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  data: T[];
};
