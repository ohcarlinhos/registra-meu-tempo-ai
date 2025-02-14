<script lang="ts" setup>
definePageMeta({ name: "home" });
useHead({ title: "Cronômetros" });
</script>

<template>
  <NuxtLayout name="home">
    <section class="flex flex-col max-md:gap-8 gap-16">
      <section class="flex flex-col gap-8 items-center">
        <h2 class="text-7xl font-bold text-center">Gerencie seu tempo!</h2>

        <p class="text-xl text-center">
          Utilize nossas ferramentas para
          <b class="text-primary">compreender melhor seu tempo gasto</b>
          <br class="max-md:hidden" />
          estudando, trabalhando ou em seus projetos pessoais.
        </p>
      </section>

      <section class="max-md:flex-col flex gap-8">
        <ClientOnly>
          <TimerDefault title="Cronômetros" />

          <template #fallback>
            <div class="flex gap-5 flex-col w-[320px] items-center">
              <Skeleton class="h-[320px] w-[320px] rounded-full" />
            </div>
          </template>
        </ClientOnly>

        <section class="flex flex-col gap-5 max-md:items-center items-start">
          <h3 class="text-4xl font-bold leading-none max-md:text-center">
            Que tal começar <br class="max-md:hidden" />
            por nossos cronômetros?
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

      <!-- <section class="flex flex-col">
      Tenha maior controle do seu tempo, independente da forma que deseja
      registrá-lo. Utilizando o cronômetro do seu celular, seu relógio,
      ampulheta ou nossos timer digitais.
    </section> -->
    </section>
  </NuxtLayout>
</template>
