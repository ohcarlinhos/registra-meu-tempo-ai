import * as yup from "yup";

export const useUserValidation = () => {
  const { $i18n } = useNuxtApp();

  const name = () =>
    yup
      .string()
      .min(3, $i18n.t("nameMin"))
      .max(120, $i18n.t("nameMax"))
      .required($i18n.t("nameIsRequired"));

  const email = () =>
    yup
      .string()
      .email($i18n.t("emailIsInvalid"))
      .required($i18n.t("emailIsRequired"));

  const password = (y = yup.string()) => {
    return y
      .min(8, $i18n.t("passwordMin"))
      .max(48, $i18n.t("passwordMax"))
      .matches(/[0-9]/, $i18n.t("passwordNeedANumber"))
      .matches(/[a-z]/, $i18n.t("passwordNeedALow"))
      .matches(/[A-Z]/, $i18n.t("passwordNeedAUpper"))
      .matches(/[^\w]/, $i18n.t("passwordNeedASymbol"))
      .required($i18n.t("passwordIsRequired"));
  };

  const confirmPassword = (y = yup.string()) => {
    return y
      .oneOf([yup.ref("password")], $i18n.t("confirmPasswordIsDifferent"))
      .required($i18n.t("confirmPasswordIsRequired"));
  };

  const oldPassword = (y = yup.string()) => {
    return y
      .min(1, $i18n.t("passwordMin"))
      .max(48, $i18n.t("passwordMax"))
      .required($i18n.t("oldPasswordIsRequired"));
  };

  return { name, email, password, confirmPassword, oldPassword };
};
