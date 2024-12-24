<script lang="ts" setup>
definePageMeta({ middleware: ["guest"], name: "recovery" });
useHead({ title: "Recuperar conta" });
</script>

<template>
  <NuxtLayout name="center">
    <AuthFormRecovery />
  </NuxtLayout>
</template>
