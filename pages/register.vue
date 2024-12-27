<script lang="ts" setup>
definePageMeta({ middleware: ["guest"], name: "register" });
useHead({ title: "Criar conta" });

onMounted(() => {
  useAuthStore().closeAuthModal();
});
</script>

<template>
  <NuxtLayout name="center">
    <UserFormRegister />
  </NuxtLayout>
</template>
