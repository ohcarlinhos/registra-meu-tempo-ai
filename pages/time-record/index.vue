<script lang="ts" setup>
definePageMeta({ middleware: ["auth"] });
</script>

<template>
  <UContainer
    :ui="{
      padding: 'py-16',
      constrained: 'min-h-svh max-w-8xl',
    }"
  >
    <GHeader small-title />

    <TimeRecordDashboard />
  </UContainer>
</template>

