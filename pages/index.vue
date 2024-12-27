<script lang="ts" setup>
definePageMeta({ name: "home" });
useHead({ title: "Cronômetros" });
</script>

<template>
  <NuxtLayout name="center">
    <TimerDefault title="Cronômetros" rounded-full />
  </NuxtLayout>
</template>
