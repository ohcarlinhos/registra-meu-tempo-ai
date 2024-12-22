<script lang="ts" setup>
definePageMeta({ name: "verify.page" });

const isFetch = ref(false);
const showRequestCodeButton = ref(false);
const disableRequestCodeButton = ref(false);

const registerCodeInfo = ref<RegisterCodeInfo>();

const userStore = useUserStore();
const { isVerified, mySelf } = storeToRefs(userStore);

const router = useRouter();

watch(
  () => isVerified.value,
  (newValue) => {
    if (newValue) router.push({ name: "record.panel" });
  }
);

const getRegisterCodeInfoAction = async () => {
  try {
    isFetch.value = true;

    const result = await getRegisterCodeInfo();
    if (!result) return;

    registerCodeInfo.value = result;

    if (result.wasSent) {
      disableRequestCodeButton.value = true;
    } else {
      showRequestCodeButton.value = true;
    }
  } catch (err) {
    if ((err as Error).message == "code_not_found") {
      showRequestCodeButton.value = true;
      return;
    }

    ErrorToast(err);
  } finally {
    isFetch.value = false;
  }
};

const requestRegisterCodeEmail = async () => {
  try {
    isFetch.value = true;

    const result = await requestRegisterCode();
    if (!result) return;

    showRequestCodeButton.value = false;

    getRegisterCodeInfoAction();
  } catch (err) {
    if ((err as Error).message == "check_your_email_inbox") {
      disableRequestCodeButton.value = true;
    }

    ErrorToast(err);
  } finally {
    isFetch.value = false;
  }
};

onMounted(async () => {
  setTitle("Confirmar E-mail");

  if (isVerified.value) {
    return router.push({ name: "record.panel" });
  }

  await getRegisterCodeInfoAction();
});
</script>

<template>
  <NuxtLayout name="center">
    <UCard :ui="{ base: 'w-full' }">
      <section
        v-if="isFetch && !showRequestCodeButton"
        class="flex justify-center"
      >
        <UIcon
          name="i-svg-spinners-180-ring-with-bg"
          class="w-7 h-7 opacity-40"
        />
      </section>

      <template v-if="showRequestCodeButton">
        <p class="pb-2">
          {{ "Você ainda não confirmou seu e-mail!" }}
        </p>

        <UFormGroup label="E-mail do cadastro" name="email">
          <UInput :model-value="mySelf?.email" disabled />
        </UFormGroup>

        <UButton
          class="mt-4"
          :disabled="disableRequestCodeButton || isVerified"
          :loading="isFetch"
          @click="requestRegisterCodeEmail"
        >
          Solicitar Código de Verificação
        </UButton>
      </template>

      <template v-else-if="registerCodeInfo">
        <p class="pt-2">
          {{
            "Enviamos o link de confirmação em seu endereço de email, caso não encontre na caixa de entrada, verifique a caixa de SPAM."
          }}
        </p>
        <p class="pt-4">
          {{ `Data de expiração: ${registerCodeInfo.formattedExpireDate}` }}
        </p>
      </template>
    </UCard>
  </NuxtLayout>
</template>
