<script lang="ts" setup>
definePageMeta({ middleware: ["auth"], name: "record.panel" });
</script>

<template>
  <NuxtLayout name="panel">
    <TimeRecordPanel />
  </NuxtLayout>
</template>
