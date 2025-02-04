<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
  name: "record.category",
  props: { breadcrumb: ["Categorias"] },
});
useHead({ title: "Categorias" });
</script>

<template>
  <NuxtLayout name="panel-v2">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-5 w-full">
      <div class="w-full col-span-1 md:col-span-6 lg:col-span-4">
        <ClientOnly>
          <CategoryTable />

          <template #fallback>
            <div class="flex gap-5 flex-col w-full items-center">
              <USkeleton class="h-[40px] w-full" />
              <USkeleton class="h-[300px] w-full" />
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>
  </NuxtLayout>
</template>
