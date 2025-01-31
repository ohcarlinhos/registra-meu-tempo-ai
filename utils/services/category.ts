export const categoryAPI = () => ({
  getAll: async (onlyWithData = false) => {
    return useCustomFetch()<CategoryMap[]>(
      `/category/all${onlyWithData ? "?onlyWithData=true" : ""}`,
      { method: "GET" }
    );
  },
  get: async (pagQuery: IPaginationQuery) => {
    return useCustomFetch()<Pagination<CategoryMap>>(
      `/category${paginationQueryHandle(pagQuery)}`,
      { method: "GET" }
    );
  },
  post: async (body: CategoryDto) => {
    return useCustomFetch(false)<CategoryMap>("/category", {
      method: "POST",
      body,
    });
  },
  put: async (id: number, body: CategoryDto) => {
    return useCustomFetch(false)<CategoryMap>(`/category/${id}`, {
      method: "PUT",
      body,
    });
  },
  delete: (id: number) => {
    return useCustomFetch(false)<boolean>(`/category/${id}`, {
      method: "DELETE",
    });
  },
});
