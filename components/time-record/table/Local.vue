<script lang="ts" setup>
const timerStore = useTimerStore();
const authStore = useAuthStore();

const modal = reactive({ open: false });

const confirmDelete = reactive({
  open: false,
  uuid: "",
});

const editTimeRecordObject = ref<TimeRecordFormType | undefined>(undefined);

const closeConfirmDeleteModal = () => {
  confirmDelete.open = false;
  confirmDelete.uuid = "";
};

const openConfirmDeleteModal = (uuid: string) => {
  confirmDelete.open = true;
  confirmDelete.uuid = uuid;
};

const deleteTimeRecord = () => {
  timerStore.deleteTimeRecord(confirmDelete.uuid);
  closeConfirmDeleteModal();
};

const columns = [
  { key: "timeRecordDate", label: "Data" },
  { key: "timePeriods", label: "Períodos" },
  { key: "formattedTime", label: "Tempo" },
  { key: "actions" },
];

const items = (row: ITimeRecordLocal) => {
  const actions = [
    [
      {
        label: "Apagar",
        icon: "i-heroicons-trash-20-solid",
        click: () => openConfirmDeleteModal(row.localUuid),
      },
    ],
  ];

  if (authStore.isAuthenticad)
    actions[0].unshift({
      label: "Persistir (Registros)",
      icon: "i-heroicons-pencil-square-20-solid",
      click: async () => openModal(row),
    });

  return actions;
};

const openModal = (timeRecord: ITimeRecordLocal) => {
  if (!timeRecord) return;

  editTimeRecordObject.value = editTimeRecordObjectFactory(timeRecord, () => {
    timerStore.deleteTimeRecord(timeRecord.localUuid);
  });

  modal.open = true;
};

const closeModal = () => {
  modal.open = false;
  editTimeRecordObject.value = undefined;
};
</script>

<template>
  <UTable
    :ui="{ base: `bg-neutral-${isDark ? '900' : '100'} rounded-md` }"
    :columns="columns"
    :rows="timerStore.timeRecords"
  >
    <template #timePeriods-data="{ row }">
      <TimeRecordTableColTimePeriod
        :time-periods="(row as ITimeRecordLocal).timePeriods"
        :label="timePeriodsLabel((row as ITimeRecordLocal).timePeriods.length)"
      />
    </template>

    <template #actions-data="{ row }">
      <div class="flex justify-end">
        <UDropdown :items="items(row)">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
          />
        </UDropdown>
      </div>
    </template>
  </UTable>

  <UModal v-model="modal.open" prevent-close>
    <TimeRecordFormCreateAndUpdate
      :edit-object="editTimeRecordObject"
      @close="closeModal"
    />
  </UModal>

  <GModalConfirm
    v-model:open="confirmDelete.open"
    text="Tem certeza que quer excluir esse registro?"
    @confirm="deleteTimeRecord"
    @cancel="closeConfirmDeleteModal"
  />
</template>
