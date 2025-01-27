export const postLogin = (body: LoginDto, token: string) => {
  return useCustomFetch(false, false)<JwtData>("/auth/login", {
    method: "POST",
    headers: { UserChallengeToken: token },
    body,
  });
};
