<script lang="ts" setup>
const props = defineProps<{}>();

const emit = defineEmits<{
  open: [value: boolean];
}>();

const clickAction = () => {
  emit("open", true);
};
</script>

<template>
  <UButton
    icon="i-icon-park-outline-help"
    variant="ghost"
    size="xl"
    title="Deixe seu feedback ou dúvida sobre a ferramenta."
    @click="clickAction"
  />
</template>
