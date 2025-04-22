export const getRegisterCodeInfo = async () => {
  return useCustomFetch(false)<RegisterCodeInfo>("/codes/register/info", {
    method: "GET",
  });
};
