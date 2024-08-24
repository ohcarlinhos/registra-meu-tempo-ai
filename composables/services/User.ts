export const postUser = async (payload: CreateUserDto) => {
  return CustomHttp<CreateUserDto, UserMap>("user", "post", payload, true);
};

export const updateUser = async (id: number, payload: UpdateUserDto) => {
  return CustomHttp<UpdateUserDto, UserMap>(`user/${id}`, "put", payload, true);
};

export const getMyself = async (mounted = false) => {
  return CustomHttp<null, UserMap>("user/myself", "get", null, mounted);
};
