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

const { rfMock, rfMockEnable } = storeToRefs(useMockStoreV2());

if (rfMockEnable.value) {
  form.name = rfMock.value.name;
  form.email = rfMock.value.email;
  form.registerCode = rfMock.value.registerCode;
  form.password = rfMock.value.password;
  form.confirmPassword = rfMock.value.confirmPassword;
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
      useAuthStoreV2().setUserToken(loginData.token);
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

      <UFormGroup :label="_$t('registerCode')" name="registerCode" required>
        <UInput type="registerCode" v-model="form.registerCode" />
        <p class="text-xs pt-1">
          Receba um código
          <a
            class="font-bold text-primary"
            href="https://forms.gle/goJ1Tzn4DRd9Wq3o7"
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
