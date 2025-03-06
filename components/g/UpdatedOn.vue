<script lang="ts" setup>
import { RefreshCw } from "lucide-vue-next";
import { format } from "date-fns";

const props = defineProps<{
  loading?: boolean;
  updatedOn?: Date;
  clickAction?: () => Promise<void>;
}>();

const updatedOnFormatted = computed(() => {
  return props.updatedOn ? format(props.updatedOn, "dd/MM/yyyy hh:mm:ss") : "";
});
</script>

<template>
  <button
    :title="`Existem atualizações de ${updatedOnFormatted}`"
    class="hover:dark:text-primary hover:text-primary text-black dark:text-white"
    @click="clickAction"
  >
    <RefreshCw :size="18" :class="{ 'animate-spin': loading }" />
  </button>
</template>
