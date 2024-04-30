type Payload = {
  name: string;
  email: string;
  password: string;
};

export const postUser = async (payload: Payload) => {
  return await CustomHttp<Payload, unknown>("user", "post", payload);
};
