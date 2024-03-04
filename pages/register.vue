<script lang="ts" setup>
import * as yup from "yup";

definePageMeta({ middleware: ["guest"] });

const pageStatus = reactive({ fetching: false });

const form = reactive({
  email: "carlinhos@teste.com",
  nome: "Carlinhos",
  senha: "123456",
  confirm_senha: "123456",
});

const schema = yup.object({
  nome: yup.string().min(3).required(),
  email: yup.string().email().required(),
  senha: yup.string().min(6).max(32).required(),
  confirm_senha: yup
    .string()
    .oneOf([yup.ref("senha")])
    .required(),
});

const submit = async () => {
  try {
    pageStatus.fetching = true;

    await postRegister(form);

    const token = await postLogin(form);
    useAuthStore().setUserToken(token);

    useRouter().push("/dashboard");
  } catch (error) {
    useToast().add({ title: error as string, color: "red" });
  } finally {
    pageStatus.fetching = false;
  }
};
</script>

<template>
  <UContainer
    :ui="{
      base: 'flex flex-col items-center justify-center gap-5',
      constrained: 'min-h-svh max-w-sm',
    }"
  >
    <UCard
      :ui="{
        base: 'w-full',
        footer: {
          base: 'text-center',
        },
      }"
    >
      <template #header> Registrar </template>

      <UForm :schema="schema" :state="form" class="space-y-4" @submit="submit">
        <UFormGroup label="Nome" name="name">
          <UInput type="text" v-model="form.nome" autofocus />
        </UFormGroup>

        <UFormGroup label="Email" name="email">
          <UInput type="email" v-model="form.email" />
        </UFormGroup>

        <UFormGroup label="Senha" name="password">
          <UInput type="password" v-model="form.senha" />
        </UFormGroup>

        <UFormGroup label="Repita a Senha" name="confirm_password">
          <UInput type="password" v-model="form.confirm_senha" />
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
          Clique aqui para acessar o Painel!
        </ULink>
      </template>
    </UCard>

    <ULink to="/dashboard" inactive-class="text-primary font-bold text-xs">
      Ir para Página Inicial
    </ULink>
  </UContainer>
</template>
~/composables/store/useAuthStore
