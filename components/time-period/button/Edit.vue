<script lang="ts" setup>
const props = defineProps<{
  timePeriod: TimePeriodMap;
}>();

const emit = defineEmits<{
  open: [value: TimePeriodForm];
}>();

const editData = reactive<TimePeriodForm>({
  id: 0,
  timeRecordId: 0,
  end: "",
  start: "",
  callback: () => {},
});

const editTimePeriod = async () => {
  const tp = props.timePeriod;

  editData.id = tp.id;
  editData.start = tp.start;
  editData.end = tp.end;
  editData.timeRecordId = tp.timeRecordId;
  editData.callback = () => {};

  emit("open", editData);
};
</script>

<template>
  <UButton
    :label="_$t('edit')"
    color="gray"
    variant="ghost"
    icon="i-icon-park-outline-edit"
    @click="editTimePeriod"
  />
</template>
