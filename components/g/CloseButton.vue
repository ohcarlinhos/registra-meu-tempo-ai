<script lang="ts" setup>
import { X } from "lucide-vue-next";
defineEmits(["close"]);
</script>

<template>
  <button
    class="hover:dark:text-primary hover:text-primary text-black dark:text-white absolute top-3 right-3"
    title="Fechar"
    @click="$emit('close')"
  >
    <X :size="18" />
  </button>
</template>
