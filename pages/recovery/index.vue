<script lang="ts" setup>
definePageMeta({ middleware: ["guest"], name: "recovery" });

onMounted(() => {
  setTitle("Recuperar Senha");
});
</script>

<template>
  <NuxtLayout name="center">
    <AuthFormRecovery />
  </NuxtLayout>
</template>
