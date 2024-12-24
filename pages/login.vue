<script lang="ts" setup>
definePageMeta({ middleware: ["guest"], name: "login" });
useHead({ title: "Acessar ferramenta" });

onMounted(() => {
  useAuthStoreV2().closeAuthModal();
});
</script>

<template>
  <NuxtLayout name="center">
    <AuthFormLogin />
  </NuxtLayout>
</template>
