import * as yup from "yup";

export class vUser {
  static t(key: string) {
    const { $i18n } = useNuxtApp();
    return $i18n.t(key);
  }

  static name() {
    return yup
      .string()
      .min(3, this.t("v.user.name.min"))
      .max(120, this.t("v.user.name.max"))
      .required(this.t("v.user.name.required"));
  }

  static email() {
    return yup
      .string()
      .email(this.t("v.email.format"))
      .required(this.t("v.email.required"));
  }

  static password(y = yup.string()) {
    return y
      .min(8, this.t("v.user.password.min"))
      .max(48, this.t("v.user.password.max"))
      .required(this.t("v.user.password.required"));
  }

  static confirmPassword(y = yup.string()) {
    return y
      .oneOf([yup.ref("password")], this.t("v.user.confirmPassword.diff"))
      .required(this.t("v.user.confirmPassword.required"));
  }

  static oldPassword(y = yup.string()) {
    return y
      .min(8, this.t("v.user.password.min"))
      .max(48, this.t("v.user.password.max"))
      .required(this.t("v.user.oldPassword.required"));
  }
}

