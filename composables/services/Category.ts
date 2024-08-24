export const getAllCategories = async function () {
  return CustomHttp<null, CategoryMap[]>("/category/all", "get", null, true);
};

export const getCategories = async function (
  pagQuery: IPaginationQuery,
  mounted = false
) {
  return CustomHttp<null, Pagination<CategoryMap>>(
    `/category?page=${pagQuery.page}&perPage=${pagQuery.perPage}&search=${pagQuery.search}`,
    "get",
    null,
    mounted
  );
};

export const postCategory = async (payload: CategoryDto) => {
  return CustomHttp<CategoryDto, CategoryMap>(
    "/category",
    "post",
    payload,
    true
  );
};

export const putCategory = async (id: number, payload: CategoryDto) => {
  return CustomHttp<CategoryDto, CategoryMap>(
    `/category/${id}`,
    "put",
    payload,
    true
  );
};

export const deleteCategory = async (id: number) => {
  return CustomHttp<null, boolean>(`/category/${id}`, "delete", null, true);
};
