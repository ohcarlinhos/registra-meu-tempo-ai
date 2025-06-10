<template>
  <NuxtLayout name="panel">
    <DashboardMain />
  </NuxtLayout>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
  name: "dashboard",
});

useConfigStore().setBreadcrumbPage([{ label: "Dashboard" }]);
</script>
