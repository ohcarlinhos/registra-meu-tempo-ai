<script lang="ts" setup>
import * as yup from "yup";

const { t } = useI18n();
const authStore = useAuthStoreV2();
const { authModal } = storeToRefs(authStore);
const { closeAuthModal, setUserToken } = authStore;

const form = reactive({
  email: "",
  password: "",
});

const { rfMock, rfMockEnable } = storeToRefs(useMockStoreV2());

if (rfMockEnable.value) {
  form.email = rfMock.value.email;
  form.password = rfMock.value.password;
}

const page = reactive({ fetch: false });

const schema = yup.object({
  email: vUser.email(),
  password: vUser.password(),
});

const submit = async () => {
  schema.validate(form).then(async () => {
    await submitAction();
  });
};

const submitAction = async () => {
  try {
    page.fetch = true;

    const data = await postLoginV2(form);

    OkToast(_$t("loginSuccess"));

    setUserToken(data!.token);

    const route = useRoute();
    const router = useRouter();

    if (route.query.backToAfter) {
      return router.push(`${route.query.backToAfter}`);
    }

    if (authModal.value.open) {
      closeAuthModal();
      return;
    }

    return router.push({ name: "record.panel" });
  } catch (error) {
    ErrorToast(error);
  } finally {
    page.fetch = false;
  }
};

const submitIsDisabled = computed(() => {
  return !form.email || !form.password;
});
</script>

<template>
  <UCard
    :ui="{
      base: 'w-full',
      footer: { base: 'text-center' },
    }"
  >
    <template #header>{{ _$t("access") }}</template>

    <UForm :schema="schema" :state="form" class="space-y-4">
      <UFormGroup :label="t('email')" name="email" required>
        <UInput type="email" v-model="form.email" autofocus />
      </UFormGroup>

      <UFormGroup :label="t('password')" name="password" required>
        <UInput type="password" v-model="form.password" />
      </UFormGroup>

      <UButton
        :loading="page.fetch"
        :disabled="submitIsDisabled"
        :label="t('access')"
        block
        @click="submit"
      />
    </UForm>

    <template #footer>
      <section class="flex gap-5 justify-center">
        <ULink
          :to="{ name: 'register' }"
          inactive-class="text-primary font-bold text-xs"
        >
          {{ _$t("createAccount") }}
        </ULink>

        <ULink
          :to="{ name: 'recovery' }"
          inactive-class="text-primary font-bold text-xs"
        >
          {{ _$t("recoveryPassword") }}
        </ULink>
      </section>
    </template>
  </UCard>
</template>
