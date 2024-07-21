<script lang="ts" setup>
defineEmits(["close"]);
</script>

<template>
  <UButton
    color="gray"
    variant="ghost"
    icon="i-heroicons-x-mark-20-solid"
    :ui="{ base: 'absolute top-3 right-3' }"
    @click="$emit('close')"
  />
</template>
