<script lang="ts" setup>
definePageMeta({ middleware: ["guest"] });
</script>

<template>
  <UContainer
    :ui="{
      base: 'flex flex-col items-center justify-center gap-5',
      constrained: 'min-h-svh max-w-sm',
    }"
  >
    <AuthFormLogin />

    <ULink to="/" inactive-class="text-primary font-bold text-xs">
      Ir para Página Inicial
    </ULink>
  </UContainer>
</template>

