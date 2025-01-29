export const postUser = async (body: CreateUserDto, token: string) => {
  return useCustomFetch(false, false)<CreateUserResult>("user", {
    method: "POST",
    headers: { UserChallengeToken: token },
    body,
  });
};

export const updateUser = async (id: number, body: UpdateUserDto) => {
  return useCustomFetch(false)<UserMap>(`user/${id}`, {
    method: "PUT",
    body,
  });
};

export const getMySelf = async () => {
  return useCustomFetch()<UserMap>("user/myself", { method: "GET" });
};

export const requestRecoveryPasswordCode = async (body: RecoveryDto) => {
  return useCustomFetch(false, false)<boolean>("/user/recovery", {
    method: "POST",
    body,
  });
};

export const recoveryNewPassword = async (body: RecoveryPasswordDto) => {
  return useCustomFetch(false, false)<boolean>("/user/recovery/password", {
    method: "POST",
    body,
  });
};

export const requestVerifyUserCode = async () => {
  return useCustomFetch(false)<boolean>("/user/verify", {
    method: "POST",
  });
};

export const verifyUser = async (code: string) => {
  return useCustomFetch(false)<boolean>(`/user/verify/${code}`, {
    method: "POST",
  });
};
