<script lang="ts" setup>
const authStore = useAuthStore();
const { closeAuthModal } = authStore;
const { authModal, isAuth } = storeToRefs(authStore);

const userStore = useUserStore();

const feedbackModal = reactive({
  open: false,
});

const route = useRoute();

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
  <template v-if="isAuth">
    <UModal v-model="feedbackModal.open" prevent-close>
      <FeedbackFormCreate @close="feedbackModal.open = false" />
    </UModal>

    <section class="fixed bottom-0 right-0 p-2 z-50">
      <FeedbackButtonNew @open="feedbackModal.open = true" />
    </section>
  </template>

  <UModal v-model="authModal.open" prevent-close>
    <AuthFormLogin v-if="authModal.open" />
  </UModal>

  <slot></slot>
</template>
