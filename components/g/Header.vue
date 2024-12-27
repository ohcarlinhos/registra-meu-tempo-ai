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
            :src="imgUrl"
            class="pt-6 w-full max-w-56 sm:max-w-xs"
            label="Registra meu tempo aí!"
            title="Registra meu tempo aí!"
          />
        </section>

        <h1 class="title-hide">Registra meu tempo aí!</h1>

        <p v-if="!hideDescription" class="pt-4">
          Gerencie seu tempo
          <span class="font-bold text-primary">
            e controle melhor sua vida.</span
          >
        </p>
      </section>

      <section v-if="$slots.right">
        <slot name="right"></slot>
      </section>
    </section>

    <nav
      v-if="!onlyGuestMode"
      class="pt-8 flex items-center flex-wrap gap-x-4 gap-y-2"
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
        {{ _$t("records") }}
      </ULink>

      <ULink
        v-if="userIsAuth"
        class="line-clamp-1"
        :to="{ name: 'statistic.day' }"
        :active-class="activeClass"
      >
        {{ "Estatísticas" }}
      </ULink>

      <ULink
        v-if="userIsAuth"
        :to="{ name: 'options' }"
        :active-class="activeClass"
      >
        {{ _$t("options") }}
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
