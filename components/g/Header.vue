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
    <section class="flex justify-between">
      <div>
        <h1
          class="font-bold text-primary"
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
      <div>
        <slot> </slot>
      </div>
    </section>

    <nav
      v-if="useRuntimeConfig().public.onlyGuestMode != '1'"
      class="pt-6 flex gap-4"
      :class="{ 'justify-center': center }"
    >
      <ULink to="/" :active-class="activeClass">Início</ULink>

      <ULink
        v-if="authStore.isAuthenticad"
        to="/time-record"
        :active-class="activeClass"
      >
        Registros
      </ULink>

      <ULink
        v-if="authStore.isAuthenticad"
        to="/options"
        :active-class="activeClass"
      >
        Opções
      </ULink>

      <ULink
        v-if="!authStore.isAuthenticad"
        to="/login"
        :active-class="activeClass"
      >
        Acesso
      </ULink>

      <ULink
        v-if="!authStore.isAuthenticad"
        to="/register"
        :active-class="activeClass"
      >
        Registrar
      </ULink>

      <UButton
        v-if="authStore.isAuthenticad"
        :padded="false"
        color="black"
        variant="link"
        size="xl"
        label="Sair"
        @click="exit"
      />
    </nav>
  </header>
</template>
