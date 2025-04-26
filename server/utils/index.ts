import * as jose from "jose";

export const decodeJwtToken = (token: string) => {
  const payload = token ? jose.decodeJwt(token) : null;

  return {
    ...payload,
    name: (payload?.unique_name as string) || "",
    email: (payload?.email as string) || "",
  };
};
