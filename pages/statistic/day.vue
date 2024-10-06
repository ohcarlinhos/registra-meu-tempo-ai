<script lang="ts" setup>
definePageMeta({ middleware: ["auth"], name: "statistic.day" });
</script>

<template>
  <NuxtLayout name="panel">
    <StatisticDay />
  </NuxtLayout>
</template>
