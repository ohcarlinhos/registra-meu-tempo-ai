<script lang="ts" setup>
definePageMeta({ middleware: ["guest"], name: "recovery" });
</script>

<template>
  <NuxtLayout name="center">
    <AuthFormRecovery />
  </NuxtLayout>
</template>
