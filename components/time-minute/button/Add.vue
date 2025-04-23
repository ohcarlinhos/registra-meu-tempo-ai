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
    variant="default"
    title="Ideal para pessoas que preferem focar longe dos computadores e celulares."
    @click="clickAction"
  >
    <CirclePlus />
    {{ "Registrar Minutos" }}
  </Button>
</template>
