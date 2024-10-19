<script lang="ts" setup>
definePageMeta({ middleware: ["auth"], name: "record.panel" });

onMounted(() => {
  setTitle(_$t("records"));
});
</script>

<template>
  <NuxtLayout name="panel">
    <TimeRecordPanel />
  </NuxtLayout>
</template>
