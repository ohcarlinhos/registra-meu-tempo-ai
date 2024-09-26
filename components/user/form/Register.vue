<script lang="ts" setup>
import * as yup from "yup";

const isFetch = ref(false);

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
    isFetch.value = true;

    await postUser(form);

    const loginData = await postLogin(form);

    if (loginData) {
      OkToast(_$t("createUserSuccess"));
      useAuthStore().setUserToken(loginData.token);
      useRouter().push({ name: "records" });
    }
  } catch (error) {
    ErrorToast(error);
  } finally {
    isFetch.value = false;
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
    <template #header>{{ _$t("toRecord") }}</template>

    <UForm :schema="schema" :state="form" class="space-y-4" @submit="submit">
      <UFormGroup :label="_$t('name')" name="name" required>
        <UInput type="text" v-model="form.name" autofocus />
      </UFormGroup>

      <UFormGroup :label="_$t('email')" name="email" required>
        <UInput type="email" v-model="form.email" />
      </UFormGroup>

      <UFormGroup :label="_$t('registerCode')" name="registerCode" required>
        <UInput type="registerCode" v-model="form.registerCode" />
        <p class="text-xs pt-1">
          Envie uma mensagem para receber um código de registro
          <a
            class="font-bold text-primary"
            href="https://www.linkedin.com/in/carlos-roberto/"
            target="_blank"
          >
            clicando aqui.
          </a>
        </p>
      </UFormGroup>

      <UFormGroup :label="_$t('password')" name="password" required>
        <UInput type="password" v-model="form.password" />
      </UFormGroup>

      <UFormGroup
        :label="_$t('confirmPassword')"
        name="confirmPassword"
        required
      >
        <UInput type="password" v-model="form.confirmPassword" />
      </UFormGroup>

      <UButton
        :label="_$t('toRecord')"
        type="submit"
        :loading="isFetch"
        block
      />
    </UForm>

    <template #footer>
      <section class="flex gap-5 justify-center">
        <ULink
          :to="{ name: 'login' }"
          inactive-class="text-primary font-bold text-xs"
        >
          {{ _$t("access") }}
        </ULink>
      </section>
    </template>
  </UCard>
</template>
