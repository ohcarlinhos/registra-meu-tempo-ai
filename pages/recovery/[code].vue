<script lang="ts" setup>
definePageMeta({ middleware: ["guest"], name: "recovery.password" });
useHead({ title: "Nova senha" });
</script>

<template>
  <NuxtLayout name="center">
    <AuthFormRecoveryUpdatePassword :code="`${$route.params.code}`" />
  </NuxtLayout>
</template>
