<script lang="ts" setup>
useHead({
  title: "Registra meu tempo aí! - Gerenciador de Tempo",
});

const colorMode = useColorMode();

const toggleDark = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

const authStore = useAuthStore();
const cs = useConfigStore();

const setOldToken = () => {
  authStore.setOldToken();
};
</script>

<template>
  <NuxtLoadingIndicator />

  <NuxtLayout>
    <UButton
      :ui="{
        base: 'absolute top-2 left-2 z-50',
      }"
      :icon="
        isDark ? 'i-icon-park-outline-moon' : 'i-icon-park-outline-sun-one'
      "
      color="gray"
      variant="ghost"
      aria-label="Theme"
      @click="toggleDark"
    />

    <section v-if="cs.hasWarTools" class="fixed top-2 right-2 z-50">
      <UButton @click="setOldToken"> Set Old Token </UButton>
    </section>

    <UModal v-model="authStore._openModal" prevent-close>
      <AuthFormLogin v-if="authStore._openModal" />
    </UModal>

    <NuxtPage />
  </NuxtLayout>

  <UNotifications />
</template>
