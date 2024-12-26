<script lang="ts" setup>
import * as yup from "yup";

const { t } = useI18n();

const authStore = useAuthStoreV2();
const { authModal } = storeToRefs(authStore);

const v = useUserValidation();

const form = reactive({
  email: "",
});

const { rfMock, rfMockEnable } = storeToRefs(useMockStoreV2());

if (rfMockEnable.value) {
  form.email = rfMock.value.email;
}

const successEmailSend = ref(false);

const page = reactive({ fetch: false });

const schema = yup.object({
  email: v.email(),
});

const submit = async () => {
  schema.validate(form).then(async () => {
    await submitAction();
  });
};

const submitAction = async () => {
  try {
    page.fetch = true;

    const data = await requestRecoveryPasswordCode({
      email: form.email,
    });

    if (!!data && typeof data == "boolean") {
      successEmailSend.value = data;
    }

    OkToast(_$t("recoveryPasswordSuccess"));
  } catch (error) {
    ErrorToast(error);
  } finally {
    page.fetch = false;
  }
};

const submitIsDisabled = computed(() => {
  return !form.email;
});
</script>

<template>
  <UCard v-if="successEmailSend" :ui="{ base: 'w-full' }">
    <p>{{ _$t("recoveryPasswordSuccess") }}</p>
  </UCard>

  <UCard
    v-else
    :ui="{
      base: 'w-full',
      footer: { base: 'text-center' },
    }"
  >
    <template #header>{{ "Recuperar senha" }}</template>

    <UForm :schema="schema" :state="form" class="space-y-4">
      <UFormGroup :label="t('email')" name="email" required>
        <UInput type="email" v-model="form.email" autofocus />
      </UFormGroup>

      <UButton
        :loading="page.fetch"
        :disabled="submitIsDisabled"
        :label="t('toRecovery')"
        block
        @click="submit"
      />
    </UForm>

    <template v-if="!authModal.open" #footer>
      <section class="flex gap-5 justify-center">
        <ULink
          :to="{ name: 'login' }"
          inactive-class="text-primary font-bold text-xs"
        >
          {{ _$t("access") }}
        </ULink>

        <ULink
          :to="{ name: 'register' }"
          inactive-class="text-primary font-bold text-xs"
        >
          {{ _$t("createAccount") }}
        </ULink>
      </section>
    </template>
  </UCard>
</template>
