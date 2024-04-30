type PayloadLogin = {
  email: string;
  password: string;
};

export const postLogin = async (payload: PayloadLogin) => {
  return await CustomHttp<PayloadLogin, { token: string }>(
    "/auth/login",
    "post",
    payload
  );
};
