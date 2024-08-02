<script lang="ts" setup>
definePageMeta({ name: "home" });
</script>

<template>
  <UContainer
    :ui="{
      base: 'flex flex-row items-center py-12',
      constrained: 'min-h-svh max-w-xl',
    }"
  >
    <div class="flex flex-col flex-1">
      <div class="flex flex-col items-center gap-10">
        <GHeader center small-title disable-padding />

        <TimerDefault />
      </div>
    </div>
  </UContainer>
</template>
