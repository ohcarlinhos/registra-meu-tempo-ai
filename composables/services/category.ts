export const getCategories = async function () {
  return await CustomHttp<null, CategoryType[]>("/category", "get");
};

type Payload = { name: string };

export const postCategory = async (payload: Payload) => {
  return await CustomHttp<Payload, CategoryType>("/category", "post", payload);
};
