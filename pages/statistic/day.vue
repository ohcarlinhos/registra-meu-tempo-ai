<script lang="ts" setup>
definePageMeta({ middleware: ["auth"], name: "statistic.day" });

onMounted(() => {
  setTitle("Resumo Diário");
});
</script>

<template>
  <NuxtLayout name="panel">
    <StatisticDay />
  </NuxtLayout>
</template>
