export const categoryApi = () => ({
  getAll: async (onlyWithData = false) => {
    return useCustomFetch()<CategoryMap[]>(
      `/categories/all${onlyWithData ? "?onlyWithData=true" : ""}`,
      { method: "GET" }
    );
  },
  get: async (pagQuery: IPaginationQuery) => {
    return useCustomFetch()<Pagination<CategoryMap>>(
      `/categories${paginationQueryHandle(pagQuery)}`,
      { method: "GET" }
    );
  },
  post: async (body: CategoryDto) => {
    return useCustomFetch(false)<CategoryMap>("/categories", {
      method: "POST",
      body,
    });
  },
  put: async (id: number, body: CategoryDto) => {
    return useCustomFetch(false)<CategoryMap>(`/categories/${id}`, {
      method: "PUT",
      body,
    });
  },
  delete: (id: number) => {
    return useCustomFetch(false)<boolean>(`/categories/${id}`, {
      method: "DELETE",
    });
  },
});
