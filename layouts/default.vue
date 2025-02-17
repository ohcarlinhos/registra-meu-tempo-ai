<script lang="ts" setup>
const { hasWarTools } = storeToRefs(useConfigStore());

const authStore = useAuthStore();
const { setExpiredToken, closeAuthModal } = authStore;
const { authModal, isAuth } = storeToRefs(authStore);

const userStore = useUserStore();
const { isVerified, isFetch: mySelfIsFetch } = storeToRefs(userStore);

const feedbackModal = reactive({
  open: false,
});

const router = useRouter();
const route = useRoute();

const setOldToken = () => {
  setExpiredToken();
};

const showNotVerifiedStatus = computed(() => {
  return isAuth.value && !mySelfIsFetch.value && !isVerified.value;
});

onMounted(() => {
  if (
    route.name &&
    [
      "home",
      "timer.page",
      "register",
      "login",
      "recovery",
      "recovery.password",
      "verify.page.code",
    ].includes(route.name.toString())
  ) {
    closeAuthModal();
  }
});
</script>

<template>
  <!-- <section
    :class="[
      'absolute lg:fixed p-2 flex justify-between w-full z-50 gap-2',
      // 'bg-primary-500 bg-opacity-10',
      // showNotVerifiedStatus && 'bg-red-500 bg-opacity-50',
    ]"
  >
    <section
      v-if="showNotVerifiedStatus"
      class="font-medium pt-1 dark:text-white text-gray-600"
    >
      <ULink
        @click="() => $router.push({ name: 'verify.page' })"
        class="dark:text-blue-300 text-blue-500"
      >
        Clique aqui para verificar seu e-mail
      </ULink>

      e utilizar nossas ferramentas, ou
      <ULink @click="logout" class="dark:text-blue-300 text-blue-500">
        clique aqui para sair
      </ULink>
      da sua conta.
    </section>

    <section
      v-if="!isAuth && $route.name != 'register'"
      class="font-medium pt-1 dark:text-white text-gray-600"
    >
      Crie uma conta para salvar seu tempo registrado em tarefas e gerar
      estatísticas
      <ULink
        @click="() => $router.push({ name: 'register' })"
        class="dark:text-blue-300 text-blue-500"
      >
        clicando aqui!
      </ULink>
    </section>

    <section
      v-else-if="!isAuth"
      class="font-medium pt-1 dark:text-white text-gray-600"
    >
      Já possui conta?
      <ULink
        @click="() => $router.push({ name: 'login' })"
        class="dark:text-blue-300 text-blue-500"
      >
        Clique aqui
      </ULink>
      para acessar.
    </section>

    <section class="flex gap-2">
      <UButton v-if="hasWarTools" @click="setOldToken">
        Definir Token Antigo
      </UButton>

      <UButton
        v-if="hasWarTools"
        @click="() => router.push({ name: 'verify.page' })"
      >
        Verificar e-mail
      </UButton>
    </section>
  </section> -->

  <template v-if="isAuth && isVerified">
    <UModal v-model="feedbackModal.open" prevent-close>
      <FeedbackFormCreate @close="feedbackModal.open = false" />
    </UModal>

    <section class="fixed bottom-0 right-0 p-2">
      <FeedbackButtonNew @open="feedbackModal.open = true" />
    </section>
  </template>

  <UModal v-model="authModal.open" prevent-close>
    <AuthFormLogin v-if="authModal.open" />
  </UModal>

  <slot></slot>
</template>
