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

type PayloadRegister = {
  nome: string;
  email: string;
  senha: string;
};

export const postRegister = async (payload: PayloadRegister) => {
  return await CustomHttp<PayloadRegister, unknown>("usuario", "post", payload);
};
