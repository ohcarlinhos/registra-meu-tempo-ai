<script lang="ts" setup>
const editTimeRecordObject = ref<TimeRecordForm>();

const props = defineProps<{
  timeRecord: TimeRecordMap;
  callback: (code?: string) => Promise<void>;
}>();

const modal = reactive({
  updateTimeRecord: {
    open: false,
  },
});

const openTimeRecordModal = () => {
  modal.updateTimeRecord.open = true;
  const tr = props.timeRecord;

  if (!tr) return;

  editTimeRecordObject.value = {
    id: tr.id,
    title: tr.title,
    description: tr.description,
    category: tr.categoryName || "",
    categoryId: tr.categoryId,
    code: tr.code || "",
    externalLink: tr.externalLink || "",
    timePeriods: [],
    callback: props.callback,
  };
};

const closeTimeRecordModal = () => {
  modal.updateTimeRecord.open = false;
  editTimeRecordObject.value = undefined;
};
</script>

<template>
  <UButton
    icon="i-icon-park-outline-edit"
    :label="_$t('edit')"
    @click="openTimeRecordModal"
  />

  <UModal v-model="modal.updateTimeRecord.open" prevent-close>
    <TimeRecordFormCreateAndUpdate
      :edit-object="editTimeRecordObject"
      hide-time-periods
      @close="closeTimeRecordModal"
    />
  </UModal>
</template>
