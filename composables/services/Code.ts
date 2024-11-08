export const getRegisterCodeInfo = async () => {
  return CustomHttp<null, RegisterCodeInfo>(
    "/confirm-code/register/info",
    "get",
    null,
    true,
    false
  );
};

export const requestRegisterCode = async () => {
  return CustomHttp<null, boolean>("/auth/verify", "post", null, true, false);
};
