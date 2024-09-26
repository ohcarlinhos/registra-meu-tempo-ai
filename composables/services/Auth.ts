export const postLogin = async (payload: LoginDto) => {
  return CustomHttp<LoginDto, JwtDta>(
    "/auth/login",
    "post",
    payload,
    true,
    false
  );
};

export const postRecovery = async (payload: RecoveryDto) => {
  return CustomHttp<RecoveryDto, boolean>(
    "/auth/recovery",
    "post",
    payload,
    true,
    false
  );
};

export const postRecoveryPassword = async (payload: RecoveryPasswordDto) => {
  return CustomHttp<RecoveryPasswordDto, boolean>(
    "/auth/recovery/password",
    "post",
    payload,
    true,
    false
  );
};
