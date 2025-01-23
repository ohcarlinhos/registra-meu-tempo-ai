<script lang="ts" setup>
const props = defineProps<{
  timeRecordId: number;
}>();

const emit = defineEmits<{
  open: [value: number];
}>();

const clickAction = () => {
  if (!props.timeRecordId) return;
  emit("open", props.timeRecordId);
};
</script>

<template>
  <UButton
    icon="i-icon-park-outline-add"
    label="Registro Manual"
    title="Adicione seu tempo registrado de forma manual, como por exemplo outro cronômetro ou um pomodoro físico."
    @click="clickAction"
  />
</template>
