import type { Pagination } from "../types/Pagination";

export const getAllCategories = async function () {
  return CustomHttp<null, CategoryType[]>("/category/all", "get", null, true);
};

export const getCategories = async function (
  page = 1,
  perPage = 5,
  search = "",
  mounted = false
) {
  return CustomHttp<null, Pagination<CategoryType>>(
    `/category?page=${page}&perPage=${perPage}&search=${search}`,
    "get",
    null,
    mounted
  );
};

type PayloadPost = { name: string };

export const postCategory = async (payload: PayloadPost) => {
  return CustomHttp<PayloadPost, CategoryType>(
    "/category",
    "post",
    payload,
    true
  );
};

export const putCategory = async (id: number, payload: PayloadPost) => {
  return CustomHttp<PayloadPost, CategoryType>(
    `/category/${id}`,
    "put",
    payload,
    true
  );
};

export const deleteCategory = async (id: number) => {
  return CustomHttp<null, TimeRecordType>(
    `/category/${id}`,
    "delete",
    null,
    true
  );
};
