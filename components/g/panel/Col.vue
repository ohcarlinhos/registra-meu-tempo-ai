<script lang="ts" setup>
const props = defineProps<{ customClass?: string }>();
</script>

<template>
  <div class="flex flex-col gap-5" :class="customClass">
    <slot> </slot>
  </div>
</template>

<style></style>
