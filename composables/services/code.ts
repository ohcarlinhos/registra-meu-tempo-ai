export const getRegisterCodeInfo = async () => {
  return useCustomFetch(false)<RegisterCodeInfo>(
    "/confirm-code/register/info",
    { method: "GET" }
  );
};

export const requestRegisterCode = async () => {
  return useCustomFetch(false)<boolean>("/auth/verify", {
    method: "POST",
  });
};

export const verifyRegisterCode = async (code: string) => {
  return useCustomFetch(false)<boolean>(`/auth/verify/${code}`, {
    method: "POST",
  });
};
