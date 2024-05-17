type PayloadPost = {
  name: string;
  email: string;
  password: string;
};

export const postUser = async (payload: PayloadPost) => {
  return CustomHttp<PayloadPost, unknown>("user", "post", payload, true);
};

type PayloadUpdate = {
  name: string;
  email: string;
  password: string;
  oldPassword: string;
};

type UpdateUserResponse = {
  name?: string;
  email?: string;
  password?: string;
  oldPassword?: string;
};

export const updateUser = async (id: number, payload: PayloadUpdate) => {
  return CustomHttp<PayloadUpdate, UpdateUserResponse>(
    `user/${id}`,
    "put",
    payload,
    true
  );
};

export const getMyself = async (mounted = false) => {
  return CustomHttp<null, UserType>("user/myself", "get", null, mounted);
};
