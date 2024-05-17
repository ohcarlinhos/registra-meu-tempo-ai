<script lang="ts" setup>
definePageMeta({ middleware: ["auth"] });
</script>

<template>
  <NuxtLayout name="panel">
    <div class="flex flex-row gap-10 flex-g items-start">
      <UserFormUpdate class="w-1/3" />
      <CategoryTable class="w-1/3" />
    </div>
  </NuxtLayout>
</template>
