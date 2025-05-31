<script lang="ts" setup>
definePageMeta({ middleware: ["auth"], name: "statistic.day" });
useHead({ title: "Resumo Diário" });
useConfigStore().setBreadcrumbPage([{ label: "Resumo Diário" }]);
</script>

<template>
  <NuxtLayout name="panel">
    <StatisticDay />
  </NuxtLayout>
</template>
