<script lang="ts" setup>
definePageMeta({ middleware: ["auth"], name: "records" });
</script>

<template>
  <NuxtLayout name="panel">
    <TimeRecordDashboard />
  </NuxtLayout>
</template>
