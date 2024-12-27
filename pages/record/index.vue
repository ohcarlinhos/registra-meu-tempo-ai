<script lang="ts" setup>
definePageMeta({ middleware: ["auth"], name: "record.panel" });
useHead({ title: "Registros" });
defineRouteRules({ robots: false });
</script>

<template>
  <NuxtLayout name="panel">
    <TimeRecordPanel />
  </NuxtLayout>
</template>
