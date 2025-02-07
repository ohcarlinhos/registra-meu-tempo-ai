<script lang="ts" setup>
definePageMeta({ name: "home" });
useHead({ title: "Cronômetros" });
</script>

<template>
  <NuxtLayout name="center">
    <ClientOnly>
      <TimerDefault title="Cronômetros" />

      <template #fallback>
        <div class="flex gap-5 flex-col w-full items-center">
          <Skeleton class="h-[320px] w-[320px] rounded-full" />
          <Skeleton class="h-[52px] w-[60%]" />
        </div>
      </template>
    </ClientOnly>
  </NuxtLayout>
</template>
