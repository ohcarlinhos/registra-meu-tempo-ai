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

const mockStore = useMockStore();

if (mockStore.registerFormEnable) {
  form.name = mockStore.registerForm.name;
  form.email = mockStore.registerForm.email;
  form.registerCode = mockStore.registerForm.registerCode;
  form.password = mockStore.registerForm.password;
  form.confirmPassword = mockStore.registerForm.confirmPassword;
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
    <template #header>{{ t("toRecord") }}</template>

    <UForm :schema="schema" :state="form" class="space-y-4" @submit="submit">
      <UFormGroup :label="t('name')" name="name" required>
        <UInput type="text" v-model="form.name" autofocus />
      </UFormGroup>

      <UFormGroup :label="t('email')" name="email" required>
        <UInput type="email" v-model="form.email" />
      </UFormGroup>

      <UFormGroup :label="t('registerCode')" name="registerCode" required>
        <UInput type="registerCode" v-model="form.registerCode" />
      </UFormGroup>

      <UFormGroup :label="t('password')" name="password" required>
        <UInput type="password" v-model="form.password" />
      </UFormGroup>

      <UFormGroup :label="t('confirmPassword')" name="confirmPassword" required>
        <UInput type="password" v-model="form.confirmPassword" />
      </UFormGroup>

      <UButton
        :label="t('toRecord')"
        type="submit"
        :loading="pageStatus.fetching"
        block
      />
    </UForm>

    <template #footer>
      <ULink to="/login" inactive-class="text-primary font-bold text-xs">
        {{ t("access") }}
      </ULink>
    </template>
  </UCard>
</template>
