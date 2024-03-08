type Payload = {
  nome: string;
  email: string;
  senha: string;
};

export const postRegister = async (payload: Payload) => {
  return await CustomHttp<Payload, unknown>("usuario", "post", payload);
};
