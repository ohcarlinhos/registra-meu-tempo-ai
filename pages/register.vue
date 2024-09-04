<script lang="ts" setup>
definePageMeta({ middleware: ["guest"], name: "register" });

onMounted(() => {
  useAuthStore().closeModal();
});
</script>

<template>
  <NuxtLayout name="center">
    <UserFormRegister />
  </NuxtLayout>
</template>
