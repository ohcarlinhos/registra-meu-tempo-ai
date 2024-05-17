<script lang="ts" setup>
import * as yup from "yup";

const pageStatus = reactive({ fetching: false });

const form = reactive({
  email: "carlinhos@test.com",
  name: "Carlinhos",
  password: "Ska$312d%$1",
  confirmPassword: "Ska$312d%$1",
});

const schema = yup.object({
  name: yup.string().min(3).max(120).required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).max(32).required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")])
    .required(),
});

const submit = async () => {
  try {
    pageStatus.fetching = true;

    await postUser(form);

    const loginData = await postLogin(form);
    useAuthStore().setUserToken(loginData.value.token);

    useRouter().push("/time-record");
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
    <template #header> Registrar</template>

    <UForm :schema="schema" :state="form" class="space-y-4" @submit="submit">
      <UFormGroup label="Nome" name="name" required>
        <UInput type="text" v-model="form.name" autofocus />
      </UFormGroup>

      <UFormGroup label="Email" name="email" required>
        <UInput type="email" v-model="form.email" />
      </UFormGroup>

      <UFormGroup label="Senha" name="password" required>
        <UInput type="password" v-model="form.password" />
      </UFormGroup>

      <UFormGroup label="Confirme a senha" name="confirmPassword" required>
        <UInput type="password" v-model="form.confirmPassword" />
      </UFormGroup>

      <UButton
        label="Registar"
        type="submit"
        :loading="pageStatus.fetching"
        block
      />
    </UForm>

    <template #footer>
      <ULink to="/login" inactive-class="text-primary font-bold text-xs">
        Acessar
      </ULink>
    </template>
  </UCard>
</template>
