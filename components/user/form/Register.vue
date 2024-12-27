<script lang="ts" setup>
import * as yup from "yup";

const v = useUserValidation();

const isFetch = ref(false);

const form = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const { rfMock, rfMockEnable } = storeToRefs(useMockStoreV2());

if (rfMockEnable.value) {
  form.name = rfMock.value.name;
  form.email = rfMock.value.email;
  form.password = rfMock.value.password;
  form.confirmPassword = rfMock.value.confirmPassword;
}

const schema = yup.object({
  name: v.name(),
  email: v.email(),
  password: v.password(),
  confirmPassword: v.confirmPassword(),
});

const submit = async () => {
  try {
    isFetch.value = true;

    await postUser(form);

    const loginData = await postLogin(form);

    if (loginData) {
      OkToast(_$t("createUserSuccess"));
      useAuthStore().setUserToken(loginData.token);
      useRouter().push({ name: "record.panel" });
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
