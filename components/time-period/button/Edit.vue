<script lang="ts" setup>
import { Edit } from "lucide-vue-next";

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

const clickAction = async () => {
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
  <Button variant="ghost" size="sm" @click="clickAction">
    <Edit />
    {{ _$t("edit") }}
  </Button>
</template>
