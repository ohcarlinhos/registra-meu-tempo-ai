import { JwtData } from "~/utils/types/api/map/JwtData";

export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
  },

  async onSuccess(event, { tokens }) {
    const { externalBaseURL } = useRuntimeConfig();

    try {
      const result = await $fetch<JwtData>("/auth/login/github", {
        baseURL: externalBaseURL,
        method: "POST",
        body: {
          accessToken: tokens.access_token,
          tokenType: tokens.token_type,
        },
      });

      const claim = decodeJwtToken(result.token);

      await setUserSession(event, {
        token: result.token,
        user: {
          name: claim.name,
          email: claim.email,
        },
      });
    } catch (err) {
      console.log(err);
    }

    return sendRedirect(event, "/");
  },

  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error("GitHub OAuth error:", error);
    return sendRedirect(event, "/");
  },
});
