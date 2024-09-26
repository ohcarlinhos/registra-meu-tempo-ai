const ErrorTranslateList = [
  ["check_your_email_inbox", "checkYourEmailInbox"],
  ["wrong_email_or_password", "wrongEmailOrPassword"],
  ["user_not_found", "userNotFound"],
];

export const TranslateErrorHandle = (tag: string) => {
  const message = ErrorTranslateList.find((e) => e[0] == tag);
  return message ? message[1] : "";
};
