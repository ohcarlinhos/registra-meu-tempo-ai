<script lang="ts" setup>
definePageMeta({ middleware: ["guest"], name: "recovery.password" });
</script>

<template>
  <NuxtLayout name="center">
    <AuthFormRecoveryUpdatePassword :code="`${$route.params.code}`" />
  </NuxtLayout>
</template>
