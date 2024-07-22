<script lang="ts" setup>
import * as yup from "yup";

const { t } = useI18n();

const pageStatus = reactive({ fetching: false });

const form = reactive({
  name: "",
  email: "",
  registerCode: "",
  password: "",
  confirmPassword: "",
});

const env = useRuntimeConfig().public;

if (env.registerFormMockEnable === "1") {
  form.name = env.registerFormMockName;
  form.email = env.registerFormMockEmail;
  form.registerCode = env.registerFormMockCode;
  form.password = env.registerFormMockPassword;
  form.confirmPassword = env.registerFormMockPassword;
}

const schema = yup.object({
  name: vUser.name(),
  email: vUser.email(),
  registerCode: vUser.registerCode(),
  password: vUser.password(),
  confirmPassword: vUser.confirmPassword(),
});

const submit = async () => {
  try {
    pageStatus.fetching = true;

    await postUser(form);

    const loginData = await postLogin(form);

    if (loginData) {
      OkToast(t("form.user.create.success"));
      useAuthStore().setUserToken(loginData.token);
      useRouter().push("/time-record");
    }
  } catch (error) {
    ErrorToast(error);
  } finally {
    pageStatus.fetching = false;
  }
};
</script>

<template>
  <UCard
    :ui="{
      base: 'w-full',
      footer: {
        base: 'text-center',
      },
    }"
  >
    <template #header>{{ t("form.user.create.title") }}</template>

    <UForm :schema="schema" :state="form" class="space-y-4" @submit="submit">
      <UFormGroup :label="t('form.user.name')" name="name" required>
        <UInput type="text" v-model="form.name" autofocus />
      </UFormGroup>

      <UFormGroup :label="t('form.user.email')" name="email" required>
        <UInput type="email" v-model="form.email" />
      </UFormGroup>

      <UFormGroup
        :label="t('form.user.registerCode')"
        name="registerCode"
        required
      >
        <UInput type="registerCode" v-model="form.registerCode" />
      </UFormGroup>

      <UFormGroup :label="t('form.user.password')" name="password" required>
        <UInput type="password" v-model="form.password" />
      </UFormGroup>

      <UFormGroup
        :label="t('form.user.confirmPassword')"
        name="confirmPassword"
        required
      >
        <UInput type="password" v-model="form.confirmPassword" />
      </UFormGroup>

      <UButton
        :label="t('form.user.create.button')"
        type="submit"
        :loading="pageStatus.fetching"
        block
      />
    </UForm>

    <template #footer>
      <ULink to="/login" inactive-class="text-primary font-bold text-xs">
        {{ t("form.register.access") }}
      </ULink>
    </template>
  </UCard>
</template>
