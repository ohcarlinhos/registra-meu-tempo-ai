<script lang="ts" setup>
definePageMeta({ middleware: ["auth"], name: "time.record.list" });
</script>

<template>
  <NuxtLayout name="panel">
    <TimeRecordDashboard />
  </NuxtLayout>
</template>
