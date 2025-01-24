export const postFeedback = async (message: string) => {
  return useCustomFetch(false)<boolean>("/feedback", {
    method: "POST",
    body: { message },
  });
};
