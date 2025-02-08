export const userApi = () => ({
  post: async (body: CreateUserDto, token: string) => {
    return useCustomFetch(false, false)<CreateUserResult>("user", {
      method: "POST",
      headers: { UserChallengeToken: token },
      body,
    });
  },
  update: async (id: number, body: UpdateUserDto) => {
    return useCustomFetch(false)<UserMap>(`user/${id}`, {
      method: "PUT",
      body,
    });
  },
  updatePassword: async (id: number, body: UpdateUserPasswordDto) => {
    return useCustomFetch(false)<boolean>(`user/password/${id}`, {
      method: "POST",
      body,
    });
  },
  getMySelf: async () => {
    return useCustomFetch()<UserMap>("user/myself", { method: "GET" });
  },
  requestRecoveryPasswordCode: async (body: RecoveryDto) => {
    return useCustomFetch(false, false)<boolean>("/user/recovery", {
      method: "POST",
      body,
    });
  },
  recoveryNewPassword: async (body: RecoveryPasswordDto) => {
    return useCustomFetch(false, false)<boolean>("/user/recovery/password", {
      method: "POST",
      body,
    });
  },
  requestVerifyUserCode: async () => {
    return useCustomFetch(false)<boolean>("/user/verify", {
      method: "POST",
    });
  },
  verifyUser: async (code: string) => {
    return useCustomFetch(false)<boolean>(`/user/verify/${code}`, {
      method: "POST",
    });
  },
});
