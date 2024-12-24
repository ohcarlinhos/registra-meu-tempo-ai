<script lang="ts" setup>
definePageMeta({ middleware: ["auth"], name: "record.panel" });
useHead({ title: "Registros" });
</script>

<template>
  <NuxtLayout name="panel">
    <TimeRecordPanel />
  </NuxtLayout>
</template>
