const ErrorTranslateList = [
  ["check_your_email_inbox", "checkYourEmailInbox"],
  ["wrong_email_or_password", "wrongEmailOrPassword"],
  ["user_not_found", "userNotFound"],
  ["recovery_code_not_found", "invalidRecoveryCode"],
  ["recovery_code_is_used_or_expired", "invalidRecoveryCode"],
  ["send_recovery_email_error", "sendRecoveryError"],
];

export const TranslateErrorHandle = (tag: string) => {
  const message = ErrorTranslateList.find((e) => e[0] == tag);
  return message ? message[1] : "";
};
