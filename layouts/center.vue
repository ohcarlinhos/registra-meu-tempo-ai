<script setup lang="ts"></script>

<template>
  <NuxtLayout>
    <GFloatToggleDarkTheme />

    <section
      class="flex flex-col items-center justify-center p-4 w-full min-h-svh"
    >
      <section
        class="flex flex-col items-center justify-center p-4 gap-10 w-full max-w-lg"
      >
        <GHeader center />
        <slot></slot>
        <GFooter />
      </section>
    </section>
  </NuxtLayout>
</template>
