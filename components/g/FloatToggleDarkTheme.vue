<template>
  <section
    :class="['absolute lg:fixed p-2 flex justify-between w-full z-50 gap-2']"
  >
    <UButton
      :icon="
        isDark ? 'i-icon-park-outline-sun-one' : 'i-icon-park-outline-moon'
      "
      :label="(!isDark && 'Experimente a noite...') || ''"
      title="Na opinião dos desenvolvedores, o modo noturno é bem mais bonito e agradável."
      color="gray"
      variant="ghost"
      @click="toggleDark"
    />
  </section>
</template>

<script lang="ts" setup></script>

<style></style>
