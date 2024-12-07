export const postUser = async (payload: CreateUserDto) => {
  return CustomHttp<CreateUserDto, UserMap>(
    "user",
    "post",
    payload,
    true,
    false
  );
};

export const updateUser = async (id: number, payload: UpdateUserDto) => {
  return CustomHttp<UpdateUserDto, UserMap>(`user/${id}`, "put", payload, true);
};

export const getMySelf = async () => {
  return useCustomFetch(true)<UserMap>("user/myself", { method: "GET" });
};
