<script lang="ts" setup>
definePageMeta({ middleware: ["auth"] });
</script>

<template>
  <NuxtLayout name="panel">
    <div class="flex flex-row gap-10 flex-g items-start">
      <div class="w-1/3 flex">
        <UserFormUpdate />
      </div>
      <div class="w-1/3 flex">
        <CategoryTable />
      </div>
    </div>
  </NuxtLayout>
</template>
