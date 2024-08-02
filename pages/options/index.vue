<script lang="ts" setup>
definePageMeta({ middleware: ["auth"] });
</script>

<template>
  <NuxtLayout name="panel">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-5">
      <div class="w-full col-span-1 md:col-span-6 lg:col-span-4">
        <UserFormUpdate />
      </div>
      <div class="w-full col-span-1 md:col-span-6 lg:col-span-4">
        <CategoryTable />
      </div>
    </div>
  </NuxtLayout>
</template>
