<script lang="ts" setup>
definePageMeta({ middleware: ["guest"], name: "register" });

onMounted(() => {
  setTitle(_$t("register"));
  useAuthStoreV2().closeAuthModal();
});
</script>

<template>
  <NuxtLayout name="center">
    <UserFormRegister />
  </NuxtLayout>
</template>
