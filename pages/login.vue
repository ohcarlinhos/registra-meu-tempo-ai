<script lang="ts" setup>
definePageMeta({ middleware: ["guest"], name: "login" });

onMounted(() => {
  setTitle(_$t("login"));
  useAuthStoreV2().closeAuthModal();
});
</script>

<template>
  <NuxtLayout name="center">
    <AuthFormLogin />
  </NuxtLayout>
</template>
