export const getRegisterCodeInfo = async () => {
  return useCustomFetch(false, false)<RegisterCodeInfo>(
    "/confirm-code/register/info",
    { method: "GET" }
  );
};

export const requestRegisterCode = async () => {
  return useCustomFetch(false, false)<boolean>("/auth/verify", {
    method: "POST",
  });
};
