type Payload = {
  email: string;
  senha: string;
};

export const postLogin = async (payload: Payload) => {
  return await CustomHttp<Payload, { token: string }>(
    "/auth/login",
    "post",
    payload
  );
};

