export const getRegisterCodeInfo = async () => {
  return useCustomFetch(false)<RegisterCodeInfo>(
    "/confirm-code/register/info",
    { method: "GET" }
  );
};
