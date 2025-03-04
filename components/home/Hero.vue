<script setup lang="ts">
import { ArrowRight } from "lucide-vue-next";
</script>

<template>
  <section class="container">
    <div
      class="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-12 md:py-32"
    >
      <div class="text-center space-y-8">
        <!-- <Badge variant="outline" class="text-sm py-2">
          <span class="mr-2">
            <Badge>New</Badge>
          </span>
          <span> Design is out now! </span>
        </Badge> -->

        <div
          class="max-w-screen-md mx-auto text-center text-4xl md:text-5xl font-bold"
        >
          <h1>
            Gerencie seu tempo de uma forma
            <span
              class="text-transparent bg-gradient-to-r from-blue-500 to-primary bg-clip-text"
            >
              mais inteligente!
            </span>
          </h1>
        </div>

        <p class="max-w-screen-sm mx-auto text-xl text-muted-foreground">
          Utilize nossas ferramentas para compreender melhor seu tempo gasto
          estudando, trabalhando ou em seus projetos pessoais.
        </p>

        <div class="space-y-4 md:space-y-0 md:space-x-4">
          <Button
            class="w-5/6 md:w-1/4 font-bold group/arrow"
            @click="$router.push({ name: 'register' })"
          >
            Criar Conta

            <ArrowRight
              class="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform"
            />
          </Button>

          <Button
            variant="secondary"
            class="w-5/6 md:w-1/4 font-bold"
            @click="$router.push({ name: 'timer.page' })"
          >
            Acessar Timer
          </Button>
        </div>
      </div>

      <div class="relative group mt-40 py-12">
        <!-- gradient shadow -->
        <div
          class="absolute -top-6 right-12 w-[90%] h-12 lg:h-[80%] bg-primary/50 blur-3xl rounded-full img-shadow-animation"
        ></div>

        <!-- <img
          class="w-full md:w-[1200px] mx-auto rounded-lg relative rouded-lg leading-none flex items-center border border-t-2 border-t-primary/30 img-border-animation"
          :src="
            mode == 'light' ? 'hero-image-light.jpg' : 'hero-image-dark.jpg'
          "
          alt="dashboard using shadcn-vue"
        /> -->

        <slot></slot>

        <!-- gradient effect img -->
        <div
          class="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background rounded-lg"
        ></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.img-shadow-animation {
  animation-name: img-shadow-animation;
  animation-iteration-count: infinite;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-direction: alternate;
}

.img-border-animation {
  animation-name: img-border-animation;
  animation-iteration-count: infinite;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-direction: alternate;
}

@keyframes img-shadow-animation {
  from {
    opacity: 0.1;
    transform: translateY(30px);
  }

  to {
    opacity: 0.5;
    transform: translateY(0px);
  }
}
@keyframes img-border-animation {
  from {
    @apply border-t-primary/10;
  }

  to {
    @apply border-t-primary/60;
  }
}
</style>
