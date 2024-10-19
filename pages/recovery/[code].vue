<script lang="ts" setup>
definePageMeta({ middleware: ["guest"], name: "recovery.password" });

onMounted(() => {
  setTitle("Recuperar Senha");
});
</script>

<template>
  <NuxtLayout name="center">
    <AuthFormRecoveryUpdatePassword :code="`${$route.params.code}`" />
  </NuxtLayout>
</template>
