<script lang="ts" setup>
definePageMeta({ name: "home" });
useHead({ title: "Cronômetros, Pomodoro e Estatísticas" });
</script>

<template>
  <NuxtLayout name="home">
    <HomeHero />

    <!-- <section class="flex flex-col max-md:gap-8 gap-16 pb-20">
      <section class="max-md:flex-col flex gap-16">
        <ClientOnly>
          <TimerDefault title="Cronômetros" />

          <template #fallback>
            <div
              class="flex gap-5 flex-col w-[280px] md:w-[320px] items-center"
            >
              <Skeleton
                class="w-[280px] md:w-[320px] h-[280px] md:h-[320px] rounded-full"
              />
            </div>
          </template>
        </ClientOnly>

        <section
          class="flex flex-col gap-5 max-md:items-center items-start z-50"
        >
          <h3 class="text-4xl font-bold leading-none max-md:text-center">
            Que tal começar <br class="max-md:hidden" />
            por nosso cronômetro?
          </h3>

          <p class="text-xl max-md:text-center">
            É extremante fácil, <b>clique no botão começar (play)</b>
            <br class="max-md:hidden" />
            e comece a utilizar diretamente do navegador.
          </p>

          <p class="text-lg max-md:text-center">
            Prefere uma tela sem muita informação? <br />
            <NuxtLink
              :to="{ name: 'timer.page' }"
              class="text-primary font-bold hover:underline"
            >
              Acessar página do cronômetro.
            </NuxtLink>
          </p>
        </section>
      </section>
    </section> -->
  </NuxtLayout>
</template>
