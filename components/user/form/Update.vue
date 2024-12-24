<script lang="ts" setup>
import * as yup from "yup";

const { mySelf } = storeToRefs(useUserStore());
const { fetchMySelf } = useUserStore();

const userStore = useUserStore();

const authStore = useAuthStoreV2();
const { setExpiredToken, clearSession } = authStore;

const pageStatus = reactive({ fetching: false });

const v = useUserValidation();

const oldEmail = ref("");

const form = reactive(<UpdateUserDto & { confirmPassword: string }>{
  name: "",
  email: "",
  password: "",
  oldPassword: "",
  confirmPassword: "",
});

const schema = yup.object({
  name: v.name(),
  email: v.email(),

  oldPassword: yup.string().when("modifyPassword", {
    is: () => form.oldPassword || form.password || form.confirmPassword,
    then: (s) => v.oldPassword(s),
    otherwise: (s) => s.notRequired(),
  }),

  password: yup.string().when("hasPassword", {
    is: () => form.password || form.oldPassword || form.confirmPassword,
    then: (s) => v.password(s),
    otherwise: (s) => s.notRequired(),
  }),

  confirmPassword: yup.string().when("confirmOldPassword", {
    is: () => form.confirmPassword || form.oldPassword || form.password,
    then: (s) => v.confirmPassword(s),
    otherwise: (s) => s.notRequired(),
  }),
});

const submit = async () => {
  if (!mySelf.value) return;

  try {
    const data = toRaw(form);

    const test = await schema.validate(data);
    if (!test) return;

    pageStatus.fetching = true;

    if (!data.password) delete data.password;
    if (!data.oldPassword) delete data.oldPassword;

    await updateUser(mySelf.value.id, form);

    OkToast(_$t("updateUserSuccess"));

    if (oldEmail.value != data.email) {
      OkToast("Faça login novamente com seu novo e-mail.");
      return logout();
    }

    form.oldPassword = "";
    form.confirmPassword = "";
    form.password = "";
  } catch (error) {
    ErrorToast(error);
  } finally {
    pageStatus.fetching = false;
  }
};

await fetchMySelf((data) => {
  if (!data) return;

  oldEmail.value = data.email;

  form.name = data.name;
  form.email = data.email;
});
</script>

<template>
  <GPanelCol custom-class="w-full">
    <GPanelTitle :text="_$t('userDate')" />

    <UCard>
      <UForm :schema="schema" :state="form" class="space-y-4" @submit="submit">
        <UFormGroup :label="_$t('name')" name="name" required>
          <UInput type="text" v-model="form.name" />
        </UFormGroup>

        <UFormGroup :label="_$t('email')" name="email" required>
          <UInput type="email" v-model="form.email" />
        </UFormGroup>

        <UFormGroup :label="_$t('oldPassword')" name="oldPassword">
          <UInput type="password" v-model="form.oldPassword" />
        </UFormGroup>

        <UFormGroup :label="_$t('newPassword')" name="password">
          <UInput type="password" v-model="form.password" />
        </UFormGroup>

        <UFormGroup :label="_$t('confirmNewPassword')" name="confirmPassword">
          <UInput type="password" v-model="form.confirmPassword" />
        </UFormGroup>

        <UButton
          :label="_$t('save')"
          :loading="pageStatus.fetching"
          type="submit"
          block
        />
      </UForm>
    </UCard>
  </GPanelCol>
</template>
