<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
  name: "record.panel",
});
useHead({ title: "Tarefas" });
useConfigStore().setBreadcrumbPage([{ label: "Tarefas" }]);
</script>

<template>
  <NuxtLayout name="panel">
    <TimeRecordPanel />
  </NuxtLayout>
</template>
