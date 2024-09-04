<script lang="ts" setup>
definePageMeta({ middleware: ["guest"], name: "register" });

onMounted(() => {
  useAuthStore().closeModal();
});
</script>

<template>
  <UContainer
    :ui="{
      base: 'flex flex-col items-center justify-center gap-5',
      constrained: 'min-h-svh max-w-sm',
    }"
  >
    <UserFormRegister />

    <ULink to="/" inactive-class="text-primary font-bold text-xs">
      {{ _$t("goToHome") }}
    </ULink>
  </UContainer>
</template>
