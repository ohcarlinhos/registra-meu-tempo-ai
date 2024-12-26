<script lang="ts" setup>
import * as yup from "yup";

const v = useUserValidation();

const props = defineProps<{
  code: string;
}>();

const isFetch = ref(false);

const form = reactive(<RecoveryPasswordDto & { confirmPassword: string }>{
  password: "",
  confirmPassword: "",
  email: "",
});

const schema = yup.object({
  email: v.email(),
  password: v.password(),
  confirmPassword: v.confirmPassword(),
});

const submit = async () => {
  const data = toRaw(form);
  if (!(await schema.validate(data))) return;

  try {
    isFetch.value = true;

    await recoveryNewPassword({ ...data, code: props.code });

    OkToast(_$t("updatePasswordSuccess"));

    useRouter().push({ name: "login" });
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
    <template #header>{{ _$t("recoveryPassword") }}</template>

    <UForm :schema="schema" :state="form" class="space-y-4" @submit="submit">
      <UFormGroup :label="_$t('email')" name="email" required>
        <UInput type="email" v-model="form.email" />
      </UFormGroup>

      <UFormGroup :label="_$t('newPassword')" name="password" required>
        <UInput type="password" v-model="form.password" />
      </UFormGroup>

      <UFormGroup
        :label="_$t('confirmPassword')"
        name="confirmPassword"
        required
      >
        <UInput type="password" v-model="form.confirmPassword" />
      </UFormGroup>

      <UButton :label="_$t('update')" :loading="isFetch" type="submit" block />
    </UForm>
  </UCard>
</template>
