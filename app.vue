<script lang="ts" setup>
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
      :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
      color="gray"
      variant="ghost"
      aria-label="Theme"
      @click="toggleDark"
    />

    <NuxtPage />
  </NuxtLayout>
  <UNotifications />
</template>
