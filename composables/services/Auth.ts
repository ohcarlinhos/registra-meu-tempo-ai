export const postLogin = async (payload: LoginDto) => {
  return CustomHttp<LoginDto, { token: string }>(
    "/auth/login",
    "post",
    payload,
    true
  );
};
