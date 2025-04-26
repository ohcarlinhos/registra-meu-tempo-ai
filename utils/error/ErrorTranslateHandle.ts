const ErrorTranslateList = [
  ["wrong_email_or_password", "wrongEmailOrPassword"],

  ["check_your_email_inbox", "checkYourEmailInbox"],

  ["recovery_code_not_found", "invalidRecoveryCode"],
  ["recovery_code_is_used_or_expired", "invalidRecoveryCode"],
  ["send_recovery_email_error", "sendRecoveryError"],

  ["email_already_in_use", "emailInUse"],
  ["user_not_found", "userNotFound"],
  ["password_not_allowed", "passwordNotAllowed"],
];

export const TranslateErrorHandle = (tag: string) => {
  const message = ErrorTranslateList.find((e) => e[0] == tag);
  return message ? message[1] : "";
};
