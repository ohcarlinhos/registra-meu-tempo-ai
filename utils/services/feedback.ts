export const postFeedback = async (message: string, token: string) => {
  return useCustomFetch(false)<boolean>("/feedback", {
    method: "POST",
    headers: { UserChallengeToken: token },
    body: { message },
  });
};
