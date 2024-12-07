import * as yup from "yup";

export const useUserValidation = () => {
  const { $i18n } = useNuxtApp();

  const name = () =>
    yup
      .string()
      .min(3, $i18n.t("v.user.name.min"))
      .max(120, $i18n.t("v.user.name.max"))
      .required($i18n.t("v.user.name.required"));

  const email = () =>
    yup
      .string()
      .email($i18n.t("v.email.format"))
      .required($i18n.t("v.email.required"));

  const password = (y = yup.string()) => {
    return y
      .min(8, $i18n.t("v.user.password.min"))
      .max(48, $i18n.t("v.user.password.max"))
      .required($i18n.t("v.user.password.required"));
  };

  const confirmPassword = (y = yup.string()) => {
    return y
      .oneOf([yup.ref("password")], $i18n.t("v.user.confirmPassword.diff"))
      .required($i18n.t("v.user.confirmPassword.required"));
  };

  const oldPassword = (y = yup.string()) => {
    return y
      .min(8, $i18n.t("v.user.password.min"))
      .max(48, $i18n.t("v.user.password.max"))
      .required($i18n.t("v.user.oldPassword.required"));
  };

  const registerCode = (y = yup.string()) => {
    return y.required($i18n.t("v.user.registerCode.required"));
  };

  return { name, email, password, confirmPassword, oldPassword, registerCode };
};