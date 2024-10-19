<script lang="ts" setup>
definePageMeta({ name: "home" });

onMounted(() => {
  setTitle();
});
</script>

<template>
  <NuxtLayout name="center">
    <TimerDefault />
  </NuxtLayout>
</template>
