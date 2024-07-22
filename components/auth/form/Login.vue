<script lang="ts" setup>
import * as yup from "yup";

const { t } = useI18n();

const form = reactive({
  email: "",
  password: "",
});

const env = useRuntimeConfig().public;

if (env.registerFormMockEnable === "1") {
  form.email = env.registerFormMockEmail;
  form.password = env.registerFormMockPassword;
}

const page = reactive({ fetch: false });

const schema = yup.object({
  email: vUser.email(),
  password: vUser.password(),
});

const submit = async () => {
  try {
    page.fetch = true;

    const data = await postLogin({
      email: form.email,
      password: form.password,
    });

    OkToast(t("form.login.success"));

    useAuthStore().setUserToken(data!.token);
    useRouter().push("/time-record");
  } catch (error) {
    ErrorToast(error);
  } finally {
    page.fetch = false;
  }
};
</script>

<template>
  <UCard
    :ui="{
      base: 'w-full',
      footer: { base: 'text-center' },
    }"
  >
    <template #header>{{ t("form.login.title") }}</template>

    <UForm :schema="schema" :state="form" class="space-y-4" @submit="submit">
      <UFormGroup :label="t('form.user.email')" name="email" required>
        <UInput type="email" v-model="form.email" autofocus />
      </UFormGroup>

      <UFormGroup :label="t('form.user.password')" name="password" required>
        <UInput type="password" v-model="form.password" />
      </UFormGroup>

      <UButton
        :loading="page.fetch"
        :label="t('form.login.button')"
        block
        type="submit"
      />
    </UForm>

    <template #footer>
      <ULink to="/register" inactive-class="text-primary font-bold text-xs">
        {{ t("form.login.create") }}
      </ULink>
    </template>
  </UCard>
</template>
