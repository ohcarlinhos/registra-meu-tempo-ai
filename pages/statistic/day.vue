<script lang="ts" setup>
definePageMeta({ middleware: ["auth"], name: "statistic.day" });
useHead({ title: "Resumos Diários" });
defineRouteRules({ robots: false });
</script>

<template>
  <NuxtLayout name="panel">
    <StatisticDay />
  </NuxtLayout>
</template>
