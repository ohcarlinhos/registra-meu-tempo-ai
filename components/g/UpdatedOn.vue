<script lang="ts" setup>
import { format } from "date-fns";

const props = defineProps<{
  disabled?: boolean;
  updatedOn?: Date;
  clickAction?: () => Promise<void>;
}>();

const updatedOnFormatted = computed(() => {
  return props.updatedOn ? format(props.updatedOn, "dd/MM/yyyy hh:mm:ss") : "";
});
</script>

<template>
  <UButton
    icon="i-icon-park-outline-refresh"
    :title="`Existem atualizações de ${updatedOnFormatted}`"
    :disabled
    color="gray"
    variant="ghost"
    @click="clickAction"
  >
    Atualizar
  </UButton>
</template>
