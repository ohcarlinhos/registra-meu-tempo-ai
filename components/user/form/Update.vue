<script lang="ts" setup>
import * as yup from "yup";

const userStore = useUserStore();
const pageStatus = reactive({ fetching: false });

const form = reactive(<PayloadUpdate>{
  email: "",
  name: "",
  password: "",
  oldPassword: "",
});

const schema = yup.object({
  name: yup.string().min(3, "Nome deve ter pelo menos 3 caractéres.").max(120),
  email: yup.string().email(),
  password: yup.string().when("hasPassword", {
    is: (value: string) => value && value.length > 0,
    then: (s) => s.required(),
    otherwise: (s) => s.notRequired(),
  }),
  oldPassword: yup.string().when("confirmOldPassword", {
    is: () => form.password && form.password.length > 0,
    then: (s) =>
      s
        .required("A confirmação da senha é obrigatória.")
        .oneOf([yup.ref("password")], "Senhas diferentes."),
    otherwise: (s) => s.notRequired(),
  }),
});

const submit = async () => {
  try {
    pageStatus.fetching = true;

    const data = toRaw(form);

    if (!data.password) delete data.password;
    if (!data.oldPassword) delete data.oldPassword;

    await updateUser(userStore.myself.id, form);
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
    <GPanelTitle text="Dados do Usuário" />

    <UCard :key="form">
      <UForm
        v-if="form.name"
        :schema="schema"
        :state="form"
        class="space-y-4"
        @submit="submit"
      >
        <UFormGroup label="Nome" name="name" required>
          <UInput type="text" v-model="form.name" autofocus />
        </UFormGroup>

        <UFormGroup label="Email" name="email" required>
          <UInput type="email" v-model="form.email" />
        </UFormGroup>

        <UFormGroup label="Nova senha" name="password">
          <UInput type="password" v-model="form.password" />
        </UFormGroup>

        <UFormGroup label="Confirme a nova senha" name="oldPassword">
          <UInput type="password" v-model="form.oldPassword" />
        </UFormGroup>

        <UButton
          label="Salvar"
          type="submit"
          :loading="pageStatus.fetching"
          block
        />
      </UForm>
    </UCard>
  </GPanelCol>
</template>

