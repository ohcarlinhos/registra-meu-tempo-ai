<script lang="ts" setup>
definePageMeta({ name: "home" });
useHead({ title: "Cronômetros" });
</script>

<template>
  <NuxtLayout name="center">
    <ClientOnly>
      <TimerDefault title="Cronômetros" />
    </ClientOnly>
  </NuxtLayout>
</template>
