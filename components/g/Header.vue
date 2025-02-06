<script lang="ts" setup>
const authStore = useAuthStore();
const { isAuth: userIsAuth } = storeToRefs(authStore);

const colorMode = useColorMode();

withDefaults(
  defineProps<{
    center?: boolean;
    smallTitle?: boolean;
    hideDescription?: boolean;
    disablePadding?: boolean;
  }>(),
  {
    center: false,
    smallTitle: false,
    hideDescription: false,
    disablePadding: false,
  }
);

const pageTitle =
  "Registra meu tempo aí! — Pomodoro, Cronômetro e Estatísticas — Registre o tempo das suas tarefas e mantenha-se focado.";

const { onlyGuestMode } = storeToRefs(useConfigStore());

const imgUrl = computed(() => {
  return `/img/rmta_${colorMode.value === "dark" ? "dark" : "light"}.svg`;
});

const activeClass = "text-primary font-bold";
</script>

<template>
  <header :class="{ 'text-center': center, 'pb-12': !disablePadding }">
    <section
      class="flex justify-between"
      :class="{ 'flex-col justify-center gap-10': center }"
    >
      <section>
        <section :class="{ 'flex justify-center': center }">
          <NuxtImg
            class="pt-6 w-full max-w-56 sm:max-w-xs"
            :src="imgUrl"
            :label="pageTitle"
            :title="pageTitle"
          />
        </section>

        <h1 class="title-hide">Registra meu tempo aí!</h1>

        <!-- <p v-if="!hideDescription" class="pt-4">
          Registre o tempo das suas tarefas
          <span class="font-bold text-primary"> e mantenha-se focado.</span>
        </p>

        <p class="text-sm">Pomodoro, Cronômetro e Estatísticas.</p> -->
      </section>

      <section v-if="$slots.right">
        <slot name="right"></slot>
      </section>
    </section>

    <nav
      v-if="!onlyGuestMode"
      class="pt-4 flex items-center flex-wrap gap-x-4 gap-y-2"
      :class="{ 'justify-center': center }"
    >
      <ULink :to="{ name: 'home' }" :active-class="activeClass">
        {{ _$t("timers") }}
      </ULink>

      <ULink
        v-if="userIsAuth"
        :to="{ name: 'record.panel' }"
        :active-class="activeClass"
      >
        {{ "Painel" }}
      </ULink>

      <ULink
        v-if="!userIsAuth"
        :to="{ name: 'login' }"
        :active-class="activeClass"
      >
        {{ _$t("access") }}
      </ULink>

      <ULink
        v-if="!userIsAuth"
        :to="{ name: 'register' }"
        :active-class="activeClass"
      >
        {{ _$t("register") }}
      </ULink>

      <UButton
        v-if="userIsAuth"
        :padded="false"
        :label="_$t('exit')"
        color="black"
        variant="link"
        size="xl"
        @click="logout"
      />
    </nav>
  </header>
</template>

<style scoped>
.title-hide {
  font-size: 0;
}
</style>
