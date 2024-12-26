export const postLogin = (body: LoginDto) => {
  return useCustomFetch(false, false)<JwtDta>("/auth/login", {
    method: "POST",
    body,
  });
};
