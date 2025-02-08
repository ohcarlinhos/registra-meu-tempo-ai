<script setup lang="ts">
const toggleDark = () => {
  const colorMode = useColorMode();
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};
</script>

<template>
  <NuxtLayout>
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

    <section></section>
    <section
      class="flex flex-col items-center justify-center py-5 w-full min-h-svh"
    >
      <section
        class="flex flex-col items-center justify-center py-5 gap-10 w-full max-w-md"
      >
        <GHeader center />
        <slot></slot>
        <GFooter />
      </section>
    </section>
  </NuxtLayout>
</template>
