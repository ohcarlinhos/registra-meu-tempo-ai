export const userApi = () => ({
  post: async (body: CreateUserDto, token: string) => {
    return useCustomFetch(false, false)<CreateUserResult>("users", {
      method: "POST",
      headers: { UserChallengeToken: token },
      body,
    });
  },
  update: async (id: number, body: UpdateUserDto) => {
    return useCustomFetch(false)<UserMap>(`users/${id}`, {
      method: "PUT",
      body,
    });
  },
  updatePassword: async (id: number, body: UpdateUserPasswordDto) => {
    return useCustomFetch(false)<boolean>(`users/password/${id}`, {
      method: "PUT",
      body,
    });
  },
  getMySelf: async () => {
    return useCustomFetch()<UserMap>("users/myself", { method: "GET" });
  },
  requestRecoveryPasswordCode: async (body: RecoveryDto) => {
    return useCustomFetch(false, false)<boolean>("/users/recovery", {
      method: "POST",
      body,
    });
  },
  recoveryPassword: async (body: RecoveryPasswordDto) => {
    return useCustomFetch(false, false)<boolean>("/users/password/recovery", {
      method: "POST",
      body,
    });
  },
  requestVerifyUserCode: async () => {
    return useCustomFetch(false)<boolean>("/users/verify", {
      method: "POST",
    });
  },
  verifyUser: async (code: string) => {
    return useCustomFetch(false)<boolean>(`/users/verify/${code}`, {
      method: "POST",
    });
  },
  get: async (pagQuery: IPaginationQuery) => {
    return useCustomFetch()<Pagination<UserMap>>(
      `/users${paginationQueryHandle(pagQuery)}`,
      { method: "GET" }
    );
  },
  delete: async (id: number) => {
    return useCustomFetch(false)<boolean>(`/users/${id}`, {
      method: "DELETE",
    });
  },
});
