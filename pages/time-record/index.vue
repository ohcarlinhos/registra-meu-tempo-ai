<script lang="ts" setup>
definePageMeta({ middleware: ["auth"], name: "time.record.list" });
</script>

<template>
  <UContainer
    :ui="{
      padding: 'py-16',
      constrained: 'min-h-svh',
    }"
  >
    <GHeader small-title />
    <TimeRecordDashboard />
  </UContainer>
</template>
