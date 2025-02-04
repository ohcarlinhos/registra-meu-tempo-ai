<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
  name: "user.me",
  props: { breadcrumb: ["Minha conta"] },
});
useHead({ title: "Minha conta" });
</script>

<template>
  <NuxtLayout name="panel-v2">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-5 w-full">
      <div class="w-full md:col-span-6 lg:col-span-4">
        <ClientOnly>
          <UserFormUpdate />

          <template #fallback>
            <div class="flex gap-5 flex-col w-full items-center">
              <USkeleton class="h-[40px] w-full" />
              <USkeleton class="h-[200px] w-full" />
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>
  </NuxtLayout>
</template>
