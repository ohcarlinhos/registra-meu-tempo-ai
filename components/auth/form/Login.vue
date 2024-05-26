<script lang="ts" setup>
import * as yup from "yup";

const form = reactive({
  email: "carlinhos@test.com",
  password: "Ska$312d%$1",
});

const pageStatus = reactive({ fetching: false });

const schema = yup.object({
  email: vUser.email(),
  password: vUser.password(),
});

const submit = async () => {
  try {
    pageStatus.fetching = true;

    const data = await postLogin({
      email: form.email,
      password: form.password,
    });

    useAuthStore().setUserToken(data!.token);
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
      footer: { base: 'text-center' },
    }"
  >
    <template #header> Acessar Painel</template>

    <UForm :schema="schema" :state="form" class="space-y-4" @submit="submit">
      <UFormGroup label="Email" name="email" required>
        <UInput type="email" v-model="form.email" autofocus />
      </UFormGroup>

      <UFormGroup label="Senha" name="password" required>
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
        Criar conta
      </ULink>
    </template>
  </UCard>
</template>

