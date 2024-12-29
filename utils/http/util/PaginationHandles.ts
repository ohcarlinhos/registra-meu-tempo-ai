export const paginationFilterQueryHandle = (
  filters: PaginationQueryFilter[]
) => {
  let query = "";

  filters.forEach(
    (f, index) =>
      (query += `filters=${f.tag}::${f.value}${
        index != filters.length - 1 ? "&" : ""
      }`)
  );

  return query;
};

export const paginationQueryHandle = (pagQuery: IPaginationQuery) => {
  let q = "";

  const addToQuery = (addQuery: string) => {
    q += Boolean(q) ? "&" + addQuery : addQuery;
  };

  if (pagQuery.page) {
    addToQuery(`page=${pagQuery.page}`);
  }

  if (pagQuery.perPage) {
    addToQuery(`perPage=${pagQuery.perPage}`);
  }

  if (pagQuery.search) {
    addToQuery(`search=${pagQuery.search}`);
  }

  if (pagQuery.filters.length) {
    addToQuery(`${paginationFilterQueryHandle(pagQuery.filters)}`);
  }

  if (pagQuery.sort) {
    addToQuery(`sort=${pagQuery.sort}`);
  }

  if (pagQuery.sortProp) {
    addToQuery(`sortProp=${pagQuery.sortProp}`);
  }

  return "?" + q;
};
