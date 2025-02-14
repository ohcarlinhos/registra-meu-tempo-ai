<script lang="ts" setup>
definePageMeta({ middleware: [], name: "timer.page" });
useHead({ title: "Cronômetros" });
</script>

<template>
  <NuxtLayout name="center">
    <section class="flex flex-col gap-2">
      <h2 class="text-2xl text-center">
        Fique à vontade para trabalhar com nossos timers, mas
        <b class="text-primary">não se limite a apenas eles!</b>
        <br class="max-md:hidden" />
      </h2>

      <p class="text-lg text-center">
        Com uma conta você pode registrar seu
        <br class="max-md:hidden" />
        tempo da forma que preferir!
      </p>
    </section>

    <ClientOnly>
      <TimerDefault title="Cronômetros" />

      <template #fallback>
        <div class="flex gap-5 flex-col w-full items-center">
          <Skeleton class="h-[320px] w-[320px] rounded-full" />
          <Skeleton class="h-[52px] w-[200px]" />
        </div>
      </template>
    </ClientOnly>
  </NuxtLayout>
</template>
