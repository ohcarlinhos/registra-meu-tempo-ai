<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
  name: "user.me",
});
useHead({ title: "Minha conta" });

useConfigStore().setBreadcrumbPage([{ label: "Minha conta" }]);
</script>

<template>
  <NuxtLayout name="panel">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-5 w-full">
      <div class="w-full md:col-span-6 lg:col-span-4">
        <UserFormUpdate />
      </div>

      <!-- <div class="w-full md:col-span-6 lg:col-span-4">
        <UserFormPassword />
      </div> -->
    </div>
  </NuxtLayout>
</template>
