export const postUser = async (payload: CreateUserDto) => {
  return CustomHttp<CreateUserDto, unknown>("user", "post", payload, true);
};

type UpdateUserResponse = {
  name?: string;
  email?: string;
  password?: string;
  oldPassword?: string;
};

export const updateUser = async (id: number, payload: UpdateUserDto) => {
  return CustomHttp<UpdateUserDto, UpdateUserResponse>(
    `user/${id}`,
    "put",
    payload,
    true
  );
};

export const getMyself = async (mounted = false) => {
  return CustomHttp<null, UserType>("user/myself", "get", null, mounted);
};
