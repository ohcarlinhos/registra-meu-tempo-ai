<script lang="ts" setup>
import * as yup from "yup";

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
  name: yup.string().min(3, "Nome deve ter pelo menos 3 caractéres.").max(120),
  email: yup.string().email(),

  oldPassword: yup.string().when("modifyPassword", {
    is: () => form.password || form.confirmPassword,
    then: (s) => s.required("Informe a senha antiga para modificar sua senha."),
    otherwise: (s) => s.notRequired(),
  }),

  password: yup.string().when("hasPassword", {
    is: () => form.oldPassword || form.confirmPassword,
    then: (s) =>
      s
        .min(8, "Mínimo de 8 caractéres.")
        .max(48, "Máximo de 48 caractéres.")
        .required("Informe a nova senha."),
    otherwise: (s) => s.notRequired(),
  }),

  confirmPassword: yup.string().when("confirmOldPassword", {
    is: () => form.oldPassword || form.password,
    then: (s) =>
      s
        .required("A confirmação da nova senha é obrigatória.")
        .oneOf([yup.ref("password")], "Senhas diferentes."),
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

    OkToast("Usuário atualizado com sucesso!");
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
      <UForm :schema="schema" :state="form" class="space-y-4" @submit="submit">
        <UFormGroup label="Nome" name="name" required>
          <UInput type="text" v-model="form.name" autofocus />
        </UFormGroup>

        <UFormGroup label="Email" name="email" required>
          <UInput type="email" v-model="form.email" />
        </UFormGroup>

        <UFormGroup label="Senha antiga" name="oldPassword">
          <UInput type="password" v-model="form.oldPassword" />
        </UFormGroup>

        <UFormGroup label="Nova senha" name="password">
          <UInput type="password" v-model="form.password" />
        </UFormGroup>

        <UFormGroup label="Confirmação da nova senha" name="confirmPassword">
          <UInput type="password" v-model="form.confirmPassword" />
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

