<script lang="ts" setup>
const authStore = useAuthStore();

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

const exit = () => {
  authStore.clearUserToken();
  useRouter().push("/login");
};

const activeClass = "text-primary font-bold";
</script>

<template>
  <header :class="{ 'text-center': center, 'pb-12': !disablePadding }">
    <section
      class="flex justify-between"
      :class="{ 'flex-col justify-center gap-10': center }"
    >
      <div>
        <UBadge variant="subtle" size="xs">Versão Alfa</UBadge>

        <h1
          class="font-bold text-primary pt-1"
          :class="{ 'text-6xl': !smallTitle, 'text-5xl': smallTitle }"
        >
          Registra meu <br />
          tempo aí!
        </h1>

        <p v-if="!hideDescription" class="pt-4">
          Sua ferramenta de
          <br v-if="center" />
          <span class="font-bold text-primary">gerenciamento de tempo.</span>
        </p>
      </div>
      <div v-if="$slots.right">
        <slot name="right"> </slot>
      </div>
    </section>

    <nav
      v-if="useRuntimeConfig().public.onlyGuestMode != '1'"
      class="pt-6 flex gap-4"
      :class="{ 'justify-center': center }"
    >
      <ULink to="/" :active-class="activeClass">{{ _$t("timers") }}</ULink>

      <ULink
        v-if="authStore.isAuthenticad"
        to="/time-record"
        :active-class="activeClass"
      >
        {{ _$t("records") }}
      </ULink>

      <ULink
        v-if="authStore.isAuthenticad"
        to="/options"
        :active-class="activeClass"
      >
        {{ _$t("options") }}
      </ULink>

      <ULink
        v-if="!authStore.isAuthenticad"
        to="/login"
        :active-class="activeClass"
      >
        {{ _$t("access") }}
      </ULink>

      <ULink
        v-if="!authStore.isAuthenticad"
        to="/register"
        :active-class="activeClass"
      >
        {{ _$t("register") }}
      </ULink>

      <UButton
        v-if="authStore.isAuthenticad"
        :padded="false"
        :label="_$t('exit')"
        color="black"
        variant="link"
        size="xl"
        @click="exit"
      />
    </nav>
  </header>
</template>
