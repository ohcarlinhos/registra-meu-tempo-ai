type PayloadLogin = {
  email: string;
  password: string;
};

export const postLogin = async (payload: PayloadLogin) => {
  return CustomHttp<PayloadLogin, { token: string }>(
    "/auth/login",
    "post",
    payload,
    true
  );
};
