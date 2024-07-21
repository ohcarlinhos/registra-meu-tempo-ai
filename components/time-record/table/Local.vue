<script lang="ts" setup>
import { watch } from "vue";

const timerStore = useTimerStore();
const authStore = useAuthStore();

const modal = reactive({ open: false });

const confirmDelete = reactive({
  open: false,
  uuid: "",
});

const editTimeRecordObject = ref<TimeRecordFormType | undefined>(undefined);

const computedPerPageList = computed(() => {
  const list = [4, 8, 12];
  return list.filter((i) => timerStore.totalItems >= i);
});

const setPage = (p: string) => {
  timerStore._page = parseInt(p);
};

const setPerPage = (p: string) => {
  timerStore._perPage = parseInt(p);
};

watch(
  () => timerStore.totalPages,
  (newTp) => {
    if (timerStore._page > newTp) timerStore._page = newTp;
  }
);

const closeConfirmDeleteModal = () => {
  confirmDelete.open = false;
  confirmDelete.uuid = "";
};

const openConfirmDeleteModal = (uuid: string) => {
  confirmDelete.open = true;
  confirmDelete.uuid = uuid;
};

const deleteAction = () => {
  timerStore.deleteTimeRecordLocal(confirmDelete.uuid);
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
    timerStore.deleteTimeRecordLocal(timeRecord.localUuid);
  });

  modal.open = true;
};

const closeModal = () => {
  modal.open = false;
  editTimeRecordObject.value = undefined;
};
</script>

<template>
  <UTable :columns="columns" :rows="timerStore.timeRecords">
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

  <div class="flex justify-between items-end mt-3">
    <UPagination
      v-if="timerStore.totalPages > 1"
      class="mt-2"
      :modelValue="timerStore._page"
      :page-count="timerStore._perPage"
      :total="timerStore.totalItems"
      @update:modelValue="setPage"
    />

    <div class="flex items-center gap-2">
      Itens por página:
      <USelect
        :modelValue="timerStore._perPage"
        :options="computedPerPageList"
        @update:modelValue="setPerPage"
      />
    </div>
  </div>

  <UModal v-model="modal.open" prevent-close>
    <TimeRecordFormCreateAndUpdate
      :edit-object="editTimeRecordObject"
      @close="closeModal"
    />
  </UModal>

  <GModalConfirm
    v-model:open="confirmDelete.open"
    text="Tem certeza que quer excluir esse registro?"
    @confirm="deleteAction"
    @cancel="closeConfirmDeleteModal"
  />
</template>
