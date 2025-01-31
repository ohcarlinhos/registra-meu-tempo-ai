<script lang="ts" setup>
definePageMeta({ name: "home" });
useHead({ title: "Cronômetros" });
</script>

<template>
  <NuxtLayout name="center">
    <ClientOnly>
      <TimerDefault title="Cronômetros" />

      <!-- <template #fallback>
        <div class="flex gap-5 flex-col w-full items-center">
          <USkeleton class="h-[50px] w-[90%]" />
          <USkeleton class="h-[210px] w-full" />
          <USkeleton class="h-[40px] w-[60%]" />
        </div>
      </template> -->
    </ClientOnly>
  </NuxtLayout>
</template>
