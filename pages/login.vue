<script lang="ts" setup>
definePageMeta({ middleware: ["guest"], name: "login" });

onMounted(() => {
  setTitle(_$t("login"));
  useAuthStore().closeModal();
});
</script>

<template>
  <NuxtLayout name="center">
    <AuthFormLogin />
  </NuxtLayout>
</template>
