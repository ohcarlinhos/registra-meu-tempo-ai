<script lang="ts" setup>
definePageMeta({ middleware: ["auth"] });
</script>

<template>
  <UContainer
    :ui="{
      padding: 'py-32',
      constrained: 'min-h-svh',
    }"
  >
    <GHeader />
    <RegistroDeTempoDashboard />
  </UContainer>
</template>
