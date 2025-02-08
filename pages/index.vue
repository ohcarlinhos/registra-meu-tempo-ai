<script lang="ts" setup>
definePageMeta({ name: "home" });
useHead({ title: "Cronômetros" });
</script>

<template>
  <NuxtLayout name="home">
    <section class="flex flex-col gap-10 items-center pb-10">
      <h2 class="text-8xl font-bold">Registe seu tempo!</h2>

      <p class="text-2xl text-center">
        Utilize <b class="text-primary">nossos cronômetros</b> ou
        <b>registre manualmente</b> <br />
        caso prefira utilizar métodos mais tradicionais!
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
