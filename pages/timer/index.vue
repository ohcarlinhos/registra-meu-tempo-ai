<script lang="ts" setup>
definePageMeta({ middleware: ["auth-timer"], name: "timer.page" });
useHead({ title: "Cronômetros" });
</script>

<template>
  <NuxtLayout name="center">
    <ClientOnly>
      <TimerDefault title="Cronômetros" />

      <template #fallback>
        <div class="flex gap-5 flex-col w-[280px] md:w-[320px] items-center">
          <Skeleton
            class="w-[280px] md:w-[320px] h-[280px] md:h-[320px] rounded-full"
          />
        </div>
      </template>
    </ClientOnly>
  </NuxtLayout>
</template>
