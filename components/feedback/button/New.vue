<script lang="ts" setup>
import { CircleHelp } from "lucide-vue-next";

const emit = defineEmits<{
  open: [value: boolean];
}>();

const clickAction = () => {
  emit("open", true);
};
</script>

<template>
  <button
    class="text-primary hover:text-black dark:hover:text-white"
    title="Deixe seu feedback ou dúvida sobre a ferramenta."
    @click="clickAction"
  >
    <CircleHelp :size="24" />
  </button>
</template>
