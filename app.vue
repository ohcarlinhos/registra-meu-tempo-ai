<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <UButton
      :ui="{
        base: 'absolute top-2 left-2',
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
