<script lang="ts" setup>
definePageMeta({ name: "verify.page" });

const isFetch = ref(false);
const showRequestCodeButton = ref(false);
const disableRequestCodeButton = ref(false);

const registerCodeInfo = ref<RegisterCodeInfo>();

onMounted(() => {
  setTitle("Confirmar E-mail");
  getRegisterCodeInfoAction();
});

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
</script>

<template>
  <NuxtLayout name="center">
    <UCard :ui="{ base: 'w-full' }">
      <template v-if="showRequestCodeButton">
        <p>
          {{ "Você ainda não confirmou seu e-mail!" }}
        </p>

        <UButton
          class="mt-4"
          :disabled="disableRequestCodeButton"
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
