<script lang="ts" setup>
definePageMeta({ middleware: ["guest"], name: "login" });

onMounted(() => {
  useAuthStore().closeModal();
});
</script>

<template>
  <NuxtLayout name="center">
    <AuthFormLogin />
  </NuxtLayout>
</template>
