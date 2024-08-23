export type BasicStoreToPagination = {
  fetch(paginationQuery: IPaginationQuery, mounted?: boolean): Promise<void>;
  isFetch: boolean;
};
