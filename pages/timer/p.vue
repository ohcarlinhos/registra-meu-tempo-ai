<script lang="ts" setup>
definePageMeta({ middleware: ["auth"], name: "timer.panel" });
useHead({ title: "Cronômetros" });
useConfigStore().setBreadcrumbPage([{ label: "Cronômetros" }]);
</script>

<template>
  <NuxtLayout name="panel-v2">
    <section
      class="h-full w-full flex flex-col items-center justify-center gap-10"
    >
      <section class="flex flex-col gap-2">
        <h2 class="text-3xl text-center">
          Agora é <b class="text-primary">com você!</b>
        </h2>

        <p class="text-lg text-center">
          Só não se esqueça de <b>vincular</b> seu <br class="max-md:hidden" />
          tempo registrado <b>à uma tarefa!</b>
        </p>
      </section>

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
    </section>
  </NuxtLayout>
</template>
