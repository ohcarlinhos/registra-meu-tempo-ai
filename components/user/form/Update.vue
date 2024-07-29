<script lang="ts" setup>
import * as yup from "yup";

const { t } = useI18n();

const userStore = useUserStore();
const pageStatus = reactive({ fetching: false });

const form = reactive(<PayloadUpdate & { confirmPassword: string }>{
  name: "",
  email: "",
  password: "",
  oldPassword: "",
  confirmPassword: "",
});

const schema = yup.object({
  name: vUser.name(),
  email: vUser.email(),

  oldPassword: yup.string().when("modifyPassword", {
    is: () => form.oldPassword || form.password || form.confirmPassword,
    then: (s) => vUser.oldPassword(s),
    otherwise: (s) => s.notRequired(),
  }),

  password: yup.string().when("hasPassword", {
    is: () => form.password || form.oldPassword || form.confirmPassword,
    then: (s) => vUser.password(s),
    otherwise: (s) => s.notRequired(),
  }),

  confirmPassword: yup.string().when("confirmOldPassword", {
    is: () => form.confirmPassword || form.oldPassword || form.password,
    then: (s) => vUser.confirmPassword(s),
    otherwise: (s) => s.notRequired(),
  }),
});

const submit = async () => {
  try {
    const data = toRaw(form);

    const test = await schema.validate(data);
    if (!test) return;

    pageStatus.fetching = true;

    if (!data.password) delete data.password;
    if (!data.oldPassword) delete data.oldPassword;

    await updateUser(userStore.myself.id, form);

    OkToast(t("form.user.update.success"));

    form.oldPassword = "";
    form.confirmPassword = "";
    form.password = "";
  } catch (error) {
    ErrorToast(error);
  } finally {
    pageStatus.fetching = false;
  }
};

await userStore.fetchMyself((data) => {
  if (!data) return;

  form.name = data.name;
  form.email = data.email;
});
</script>

<template>
  <GPanelCol custom-class="w-full">
    <GPanelTitle :text="t('form.user.update.title')" />

    <UCard>
      <UForm :schema="schema" :state="form" class="space-y-4" @submit="submit">
        <UFormGroup :label="t('name')" name="name" required>
          <UInput type="text" v-model="form.name" autofocus />
        </UFormGroup>

        <UFormGroup :label="t('email')" name="email" required>
          <UInput type="email" v-model="form.email" />
        </UFormGroup>

        <UFormGroup :label="t('oldPassword')" name="oldPassword">
          <UInput type="password" v-model="form.oldPassword" />
        </UFormGroup>

        <UFormGroup :label="t('newPassword')" name="password">
          <UInput type="password" v-model="form.password" />
        </UFormGroup>

        <UFormGroup :label="t('confirmNewPassword')" name="confirmPassword">
          <UInput type="password" v-model="form.confirmPassword" />
        </UFormGroup>

        <UButton
          :label="t('save')"
          :loading="pageStatus.fetching"
          type="submit"
          block
        />
      </UForm>
    </UCard>
  </GPanelCol>
</template>
