export type PaginationQueryFilter = {
  tag: string;
  value: string;
};

export interface IPaginationQuery {
  page: number;
  perPage: number;
  search: string;
  filters: PaginationQueryFilter[];
}
