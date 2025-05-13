<script lang="ts" setup>
import { LoaderCircle } from "lucide-vue-next";

definePageMeta({
  middleware: [
    "disabled",
    // "auth"
  ],
  name: "verify.page",
});
useHead({ title: "Verificar conta" });

const isFetch = ref(false);
const showRequestCodeButton = ref(false);
const disableRequestCodeButton = ref(false);

const verifyCodeInfo = ref<RegisterCodeInfo>();

// const userStore = useUserStore();
// const { isVerified, mySelf } = storeToRefs(userStore);

const router = useRouter();

// watch(
//   () => isVerified.value,
//   (newValue) => {
//     if (newValue) router.push({ name: "record.panel" });
//   }
// );

const getRegisterCodeInfoAction = async () => {
  try {
    isFetch.value = true;

    const result = await getRegisterCodeInfo();
    if (!result) return;

    verifyCodeInfo.value = result;

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

const requestVerifyUserCodeEmail = async () => {
  try {
    isFetch.value = true;

    const result = await userApi().requestVerifyUserCode();
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
  // if (isVerified.value) {
  //   return router.push({ name: "record.panel" });
  // }

  await getRegisterCodeInfoAction();
});
</script>

<template>
  <NuxtLayout name="center">
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Confirmação de e-mail</CardTitle>
      </CardHeader>

      <CardContent>
        <section
          v-if="isFetch && !showRequestCodeButton"
          class="flex justify-center"
        >
          <Component v-if="isFetch" class="animate-spin" :is="LoaderCircle" />
        </section>

        <template v-if="showRequestCodeButton">
          <p class="pb-2">
            {{ "Você ainda não confirmou seu e-mail!" }}
          </p>

          <p class="text-sm font-medium leading-none pb-2 mt-2">
            {{ "E-mail do cadastro" }}
          </p>

          <!-- <Input :model-value="mySelf?.email" class="mb-2" disabled /> -->

          <!-- <Button
            class="mt-4 w-full"
            :disabled="disableRequestCodeButton || isVerified"
            :loading="isFetch"
            @click="requestVerifyUserCodeEmail"
          >
            Solicitar código de verificação
          </Button> -->
        </template>

        <template v-else-if="verifyCodeInfo">
          <p class="pt-2">
            {{
              "Enviamos o link de confirmação em seu endereço de email, caso não encontre na caixa de entrada, verifique a caixa de SPAM."
            }}
          </p>

          <!-- <p class="pt-4">
            {{ `E-mail: ${mySelf?.email}` }}
          </p> -->

          <p>
            {{ `Data de expiração: ${verifyCodeInfo.formattedExpireDate}` }}
          </p>
        </template>
      </CardContent>
    </Card>
  </NuxtLayout>
</template>
