<script lang="ts" setup>
import * as yup from "yup";

const form = reactive({
  email: "carlinhos@test.com",
  password: "Ska$312d%$1",
});

const pageStatus = reactive({ fetching: false });

const schema = yup.object({
  email: yup
    .string()
    .email("Digite um e-mail válido.")
    .required("Digite seu e-mail"),
  password: yup.string().min(6).max(32).required("Informe sua senha"),
});

const submit = async () => {
  try {
    pageStatus.fetching = true;

    const data = await postLogin({
      email: form.email,
      password: form.password,
    });

    useAuthStore().setUserToken(data.value.token);
    useRouter().push("/registros");
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
      footer: { base: 'text-center' },
    }"
  >
    <template #header> Acessar Painel</template>

    <UForm :schema="schema" :state="form" class="space-y-4" @submit="submit">
      <UFormGroup label="Email" name="email">
        <UInput type="email" v-model="form.email" autofocus />
      </UFormGroup>

      <UFormGroup label="Senha" name="password">
        <UInput type="password" v-model="form.password" />
      </UFormGroup>

      <UButton
        :loading="pageStatus.fetching"
        block
        type="submit"
        label="Entrar"
      />
    </UForm>

    <template #footer>
      <ULink to="/register" inactive-class="text-primary font-bold text-xs">
        Clique aqui para criar um usuário!
      </ULink>
    </template>
  </UCard>
</template>
