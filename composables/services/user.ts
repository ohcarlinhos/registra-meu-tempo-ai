export const postUser = async (body: CreateUserDto) => {
  return useCustomFetch(false, false)<UserMap>("user", {
    method: "POST",
    body,
  });
};

export const updateUser = async (id: number, body: UpdateUserDto) => {
  return useCustomFetch()<UserMap>(`user/${id}`, {
    method: "PUT",
    body,
  });
};

export const getMySelf = async () => {
  return useCustomFetch(true)<UserMap>("user/myself", { method: "GET" });
};
