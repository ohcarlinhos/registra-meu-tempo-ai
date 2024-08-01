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
    <GHeader small-title :center="$viewport.isLessThan('tablet')">
      <TimerDefault
        :float="$viewport.isGreaterThan('tablet')"
        options-modal
        refresh-time-records
      />
    </GHeader>

    <TimeRecordDashboard />
  </UContainer>
</template>
