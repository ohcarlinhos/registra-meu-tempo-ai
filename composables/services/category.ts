export const getAllCategories = async function () {
  return await CustomHttp<null, CategoryType[]>("/category/all", "get");
};

type Payload = { name: string };

export const postCategory = async (payload: Payload) => {
  return await CustomHttp<Payload, CategoryType>("/category", "post", payload);
};
