export type PaginationQueryFilter = {
  tag: string;
  value: string;
};

export interface IPaginationQuery {
  page: number;
  perPage: number;
  search: string;
  sort: "asc" | "desc";
  sortProp: string;
  filters: PaginationQueryFilter[];
}

export interface IPaginationQueryMethods {
  setPage: (value?: number | string) => void;
  setPerPage: (value?: number | string) => void;
  setSearch: (value: string) => void;
  addFilter: (filter: PaginationQueryFilter) => void;
  removeFilter: (tag: string) => void;
  updateSort: (direction: "asc" | "desc", prop: string) => void;
  fetchData: () => Promise<void>;
  refetchData: () => Promise<void>;
  delete: (id: number) => Promise<void>;
}
