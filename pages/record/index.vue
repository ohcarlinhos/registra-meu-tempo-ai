<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
  name: "record.panel",
  props: { breadcrumb: ["Tarefas"] },
});
useHead({ title: "Tarefas" });
</script>

<template>
  <NuxtLayout name="panel-v2">
    <ClientOnly>
      <TimeRecordPanel />
    </ClientOnly>
  </NuxtLayout>
</template>
