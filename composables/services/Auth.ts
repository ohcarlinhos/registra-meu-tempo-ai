export const postLogin = async (payload: LoginDto) => {
  return CustomHttp<LoginDto, JwtDta>(
    "/auth/login",
    "post",
    payload,
    true,
    false
  );
};
