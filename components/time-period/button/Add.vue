<script lang="ts" setup>
import { CirclePlus } from "lucide-vue-next";

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
  <Button
    variant="outline"
    title="Adicione seu tempo registrado de forma manual, como por exemplo outro cronômetro ou um pomodoro físico."
    @click="clickAction"
  >
    <CirclePlus />
    {{ "Registro de Tempo (Manual)" }}
  </Button>
</template>
