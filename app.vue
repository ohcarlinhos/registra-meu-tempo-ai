<script lang="ts" setup>
useHead({
  title: "Registra meu tempo aí! - Gerenciador de Tempo",
});

const colorMode = useColorMode();

const toggleDark = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
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
    <NuxtPage />
  </NuxtLayout>

  <UNotifications />
</template>
