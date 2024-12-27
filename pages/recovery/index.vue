<script lang="ts" setup>
definePageMeta({ middleware: ["guest"], name: "recovery" });
useHead({ title: "Recuperar conta" });
defineRouteRules({ robots: false });
</script>

<template>
  <NuxtLayout name="center">
    <AuthFormRecovery />
  </NuxtLayout>
</template>
