export const getAllCategories = async (onlyWithData = false) => {
  return useCustomFetch()<CategoryMap[]>(
    `/category/all${onlyWithData ? "?onlyWithData=true" : ""}`,
    { method: "GET" }
  );
};

export const getCategories = async (pagQuery: IPaginationQuery) => {
  return useCustomFetch()<CategoryMap[]>(
    `/category${paginationQueryHandle(pagQuery)}`,
    { method: "GET" }
  );
};

export const postCategory = async (body: CategoryDto) => {
  return useCustomFetch(false)<CategoryMap>("/category", {
    method: "POST",
    body,
  });
};

export const putCategory = async (id: number, body: CategoryDto) => {
  return useCustomFetch(false)<CategoryMap>(`/category/${id}`, {
    method: "PUT",
    body,
  });
};

export const deleteCategory = async (id: number) => {
  return useCustomFetch(false)<boolean>(`/category/${id}`, {
    method: "DELETE",
  });
};
