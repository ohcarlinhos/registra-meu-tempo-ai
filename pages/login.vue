<script lang="ts" setup>
definePageMeta({ middleware: ["guest"], name: "login" });
useHead({ title: "Acessar ferramenta" });
</script>

<template>
  <NuxtLayout name="center">
    <AuthFormLogin />
  </NuxtLayout>
</template>
