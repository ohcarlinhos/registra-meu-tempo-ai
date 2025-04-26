<script lang="ts" setup>
definePageMeta({
  middleware: [
    "disabled",
    // "guest"
  ],
  name: "register",
});
useHead({ title: "Criar conta" });
</script>

<template>
  <NuxtLayout name="center">
    <UserFormRegister />
  </NuxtLayout>
</template>
