<script lang="ts" setup>
const props = defineProps<{
  timeRecordId: number;
}>();

const emit = defineEmits<{
  open: [value: number];
}>();

const openModal = () => {
  if (!props.timeRecordId) return;
  emit("open", props.timeRecordId);
};
</script>

<template>
  <UButton
    icon="i-icon-park-outline-add"
    :label="_$t('period')"
    @click="openModal"
  />
</template>
