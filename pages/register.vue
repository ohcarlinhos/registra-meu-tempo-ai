<script lang="ts" setup>
definePageMeta({ middleware: ["guest"], name: "register" });
useHead({ title: "Criar conta" });

onMounted(() => {
  useAuthStoreV2().closeAuthModal();
});
</script>

<template>
  <NuxtLayout name="center">
    <UserFormRegister />
  </NuxtLayout>
</template>
