<script lang="ts" setup></script>

<template>
  <UContainer
    :ui="{
      padding: 'py-16',
      constrained: 'min-h-svh',
    }"
  >
    <GHeader small-title />
    <slot></slot>
  </UContainer>
</template>
