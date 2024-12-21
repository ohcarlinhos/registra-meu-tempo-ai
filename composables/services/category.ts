export const getAllCategories = async (onlyWithData = false) => {
  return useCustomFetch(true, false)<CategoryMap[]>(
    `/category/all${onlyWithData ? "?onlyWithData=true" : ""}`,
    { method: "GET" }
  );
};

export const getCategories = async (pagQuery: IPaginationQuery) => {
  return useCustomFetch(true, false)<CategoryMap[]>(
    `/category${paginationQueryHandle(pagQuery)}`,
    { method: "GET" }
  );
};

export const postCategory = async (body: CategoryDto) => {
  return useCustomFetch(true, false)<CategoryMap>("/category", {
    method: "POST",
    body,
  });
};

export const putCategory = async (id: number, body: CategoryDto) => {
  return useCustomFetch(true, false)<CategoryMap>(`/category/${id}`, {
    method: "PUT",
    body,
  });
};

export const deleteCategory = async (id: number) => {
  return useCustomFetch(true, false)<boolean>(`/category/${id}`, {
    method: "DELETE",
  });
};
