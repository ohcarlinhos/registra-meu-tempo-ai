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
  let query = "?";

  if (pagQuery.page) query += `page=${pagQuery.page}`;
  if (pagQuery.perPage) query += `&perPage=${pagQuery.perPage}`;
  if (pagQuery.search) query += `&search=${pagQuery.search}`;
  if (pagQuery.filters.length)
    query += `&${paginationFilterQueryHandle(pagQuery.filters)}`;

  return query;
};
