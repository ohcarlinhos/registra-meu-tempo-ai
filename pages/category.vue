<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
  name: "record.category",
});
useHead({ title: "Categorias" });
useConfigStore().setBreadcrumbPage([{ label: "Categorias" }]);
</script>

<template>
  <NuxtLayout name="panel">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-5 w-full">
      <div class="w-full col-span-1 md:col-span-12 lg:col-span-6">
        <CategoryTable />
      </div>
    </div>
  </NuxtLayout>
</template>
