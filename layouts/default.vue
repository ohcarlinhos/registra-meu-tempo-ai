<script lang="ts" setup>
const authStore = useAuthStore();
const { closeAuthModal } = authStore;
const { authModal } = storeToRefs(authStore);

const route = useRoute();

onMounted(() => {
  if (
    route.name &&
    [
      "home",
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
  <Dialog
    v-bind:open="authModal.open"
    @update:open="!$event && (authModal.open = false)"
  >
    <DialogContent @interact-outside="$event.preventDefault()" hide-close>
      <DialogHeader>
        <DialogTitle>{{ _$t("access") }}</DialogTitle>

        <DialogDescription>
          Forneça suas credenciais para acessar a ferramenta.
        </DialogDescription>
      </DialogHeader>

      <AuthFormLogin v-if="authModal.open" />
    </DialogContent>
  </Dialog>

  <slot></slot>
</template>
