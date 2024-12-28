export type BasicStoreToPagination = {
  fetch(mounted?: boolean): Promise<void>;
  paginationQuery: IPaginationQuery;
  isFetch: boolean;
};
