<script lang="ts" setup>
definePageMeta({ middleware: ["auth"], name: "record.panel" });
useHead({ title: "Tarefas" });
</script>

<template>
  <NuxtLayout name="panel">
    <ClientOnly>
      <TimeRecordPanel />
    </ClientOnly>
  </NuxtLayout>
</template>
