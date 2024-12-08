export const postRecovery = async (body: RecoveryDto) => {
  return useCustomFetch(false, false)<boolean>("/auth/recovery", {
    method: "POST",
    body,
  });
};

export const postRecoveryPassword = async (body: RecoveryPasswordDto) => {
  return useCustomFetch(false, false)<boolean>("/auth/recovery/password", {
    method: "POST",
    body,
  });
};

export const postLogin = (body: LoginDto) => {
  return useCustomFetch(false, false)<JwtDta>("/auth/login", {
    method: "POST",
    body,
  });
};
