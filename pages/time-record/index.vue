<script lang="ts" setup>
definePageMeta({ middleware: ["auth"] });
</script>

<template>
  <UContainer
    :ui="{
      padding: 'py-16',
      constrained: 'min-h-svh',
    }"
  >
    <GHeader small-title>
      <TimerDefault float options-modal />
    </GHeader>

    <TimeRecordDashboard />
  </UContainer>
</template>
