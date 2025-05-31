import { hash } from "crypto";
import * as yup from "yup";
import { FetchError } from "ofetch";
import { JwtData } from "~/utils/types/api/map/JwtData";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (b) =>
    yup
      .object({
        password: yup.string().required(),
        email: yup.string().required(),
        token: yup.string(),
      })
      .validate(b)
  );

  const { externalBaseURL } = useRuntimeConfig();

  try {
    const result = await $fetch<JwtData>("/auth/login", {
      baseURL: externalBaseURL,
      method: "POST",
      headers: {
        UserChallengeToken: body.token || "",
        "User-Agent": event.headers.get("User-Agent")?.toString() || "",
        "X-Forwarded-For":
          event.node.req.headers["x-forwarded-for"]?.toString() || "",
      },
      body,
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

    return result;
  } catch (err) {
    var error = err as FetchError;

    throw createError({
      status: error.status,
      statusMessage: error.message,
      message: error.data.message,
    });
  }
});
