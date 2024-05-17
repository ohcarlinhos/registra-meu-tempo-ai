import type { Pagination } from "../general/types/Pagination";

export const getAllCategories = async function () {
  return await CustomHttp<null, CategoryType[]>("/category/all", "get");
};

export const getCategories = async function (
  page = 1,
  perPage = 5,
  search = ""
) {
  return await CustomHttp<null, Pagination<CategoryType>>(
    `/category?page=${page}&perPage=${perPage}&search=${search}`,
    "get"
  );
};

type Payload = { name: string };

export const postCategory = async (payload: Payload) => {
  return await CustomHttp<Payload, CategoryType>("/category", "post", payload);
};

export const deleteCategory = async (id: number) => {
  return await CustomHttp<null, TimeRecordType>(`/category/${id}`, "delete");
};
