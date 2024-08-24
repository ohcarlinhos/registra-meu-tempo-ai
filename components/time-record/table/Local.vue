<script lang="ts" setup>
import { watch } from "vue";

const timerStore = useTimerStore();
const authStore = useAuthStore();

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    refreshTimeRecords?: boolean;
  }>(),
  {}
);

const modal = reactive({ open: false });

const confirmDelete = reactive({
  open: false,
  uuid: "",
});

const editTimeRecordObject = ref<TimeRecordForm | undefined>(undefined);

watch(
  () => timerStore.totalPages,
  (newTotalPages) => {
    if (timerStore._page > newTotalPages) timerStore._page = newTotalPages;
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
  { key: "code", label: _$t("code") },
  { key: "actions" },
];

const items = (row: TimeRecordLocal) => {
  const actions = [
    [
      {
        label: "Apagar do Navegador",
        icon: "i-icon-park-outline-delete-themes",
        click: () => openConfirmDeleteModal(row.localUuid),
      },
    ],
  ];

  if (authStore.isAuth) {
    if (row.id) {
      actions[0].unshift({
        label: "Sincronizar (Registro)",
        icon: "i-icon-park-outline-refresh-one",
        click: async () => openModal(row, true),
      });
    } else {
      actions[0].unshift({
        label: "Persistir (Registros)",
        icon: "i-icon-park-outline-save-one",
        click: async () => openModal(row),
      });
    }
  }

  return actions;
};

const openModal = (timeRecord: TimeRecordLocal, isSync = false) => {
  if (!timeRecord) return;

  editTimeRecordObject.value = timeRecordLocalToForm(
    { ...timeRecord, isSync },
    () => {
      timerStore.deleteTimeRecordLocal(timeRecord.localUuid);
    }
  );

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
        :period-list="(row as TimeRecordLocal).timePeriods"
        :label="timePeriodsLabel((row as TimeRecordLocal).timePeriods.length)"
      />
    </template>

    <template #code-data="{ row }">
      {{ row.code || "-" }}
    </template>

    <template #actions-data="{ row }">
      <div class="flex justify-end">
        <UDropdown :items="items(row)">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-icon-park-outline-more-one"
          />
        </UDropdown>
      </div>
    </template>
  </UTable>

  <GPagination
    :page="timerStore._page"
    :perPage="timerStore._perPage"
    :totalPages="timerStore.totalPages"
    :totalItems="timerStore.totalItems"
    @update:page="(value) => (timerStore._page = value)"
    @update:perPage="(value) => (timerStore._perPage = value)"
  />

  <UModal v-model="modal.open" prevent-close>
    <TimeRecordFormCreateAndUpdate
      :edit-object="editTimeRecordObject"
      :refresh-time-records="props.refreshTimeRecords"
      @close="closeModal"
    />
  </UModal>

  <GModalConfirm
    v-model:open="confirmDelete.open"
    :title="_$t('confirmDeleteTimeRecordMessage')"
    @confirm="deleteAction"
    @cancel="closeConfirmDeleteModal"
  />
</template>
