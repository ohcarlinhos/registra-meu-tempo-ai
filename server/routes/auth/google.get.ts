import { hash } from "crypto";
import { JwtData } from "~/utils/types/api/map/JwtData";

export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { tokens }) {
    const { externalBaseURL } = useRuntimeConfig();

    try {
      const result = await $fetch<JwtData>("/auth/login/google", {
        baseURL: externalBaseURL,
        method: "POST",
        body: {
          accessToken: tokens.access_token,
          tokenType: tokens.token_type,
        },
        headers: {
          "User-Agent": event.headers.get("User-Agent")?.toString() || "",
          "X-Forwarded-For":
            event.node.req.headers["x-forwarded-for"]?.toString() || "",
        },
      });

      const claim = decodeJwtToken(result.token);

      await setUserSession(event, {
        token: result.token,
        user: {
          name: claim.name,
          email: claim.email,
          hashEmail: hash("sha256", claim.email),
        },
      });
    } catch (err) {
      console.log(err);
    }

    return sendRedirect(event, "/login/success?provider=google");
  },

  onError(event, error) {
    console.error("Google OAuth error:", error);
    return sendRedirect(event, "/");
  },
});
