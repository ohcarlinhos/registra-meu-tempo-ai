<script lang="ts" setup>
import { watch } from "vue";

const timerStore = useTimerStore();

const authStore = useAuthStore();
const { isAuth: userIsAuth } = storeToRefs(authStore);

const userStore = useUserStore();
const { isVerified: userIsVerified } = storeToRefs(userStore);

const props = withDefaults(
  defineProps<{
    id: number | null;
    postTimePeriodCallback: (code: string) => void;
  }>(),
  {
    id: null,
    postTimePeriodCallback: (code = "") => {},
  }
);

const timer = computed(() => timerStore.getTimer(props.id));

const timeRecords = computed(() => timerStore.getTimeRecords(props.id));

const totalPages = computed(() =>
  Math.ceil(timer.value.localRecords.length / timerStore._perPage)
);

const modal = reactive({ open: false });

const confirmDelete = <
  {
    open: boolean;
    uuid: string;
    id: number | null;
  }
>reactive({
  open: false,
  uuid: "",
  id: null,
});

const editTimeRecordObject = ref<TimeRecordForm | undefined>(undefined);

watch(
  () => timer.value.localRecords.length,
  (newTotalPages) => {
    if (timer.value.page > newTotalPages) timer.value.page = newTotalPages;
  }
);

const closeConfirmDeleteModal = () => {
  confirmDelete.open = false;
  confirmDelete.uuid = "";
  confirmDelete.id = null;
};

const openConfirmDeleteModal = (uuid: string, id: number | null) => {
  confirmDelete.open = true;
  confirmDelete.uuid = uuid;
  confirmDelete.id = id;
};

const deleteAction = () => {
  timerStore.deleteTimeRecordLocal(confirmDelete.uuid, props.id);
  closeConfirmDeleteModal();
};

const columns = [
  { key: "timeRecordDate", label: "Data" },
  { key: "timePeriods", label: "Períodos" },
  { key: "formattedTime", label: "Tempo" },
  { key: "actions" },
];

const items = (row: TimeRecordLocal) => {
  const actions = [
    [
      {
        label: "Apagar sessão do navegador",
        icon: "i-icon-park-outline-delete-themes",
        disabled: false,
        click: () => openConfirmDeleteModal(row.localUuid, row.id),
      },
    ],
  ];

  if (userIsAuth.value) {
    if (row.id) {
      actions[0].unshift({
        label: "Sincronizar sessão com registro",
        icon: "i-icon-park-outline-refresh-one",
        disabled: !userIsVerified.value,
        click: async () => openModal(row, true),
      });
    } else {
      actions[0].unshift({
        label: "Vincular sessão à registro existente",
        icon: "i-icon-park-outline-refresh-one",
        disabled: !userIsVerified.value,
        click: async () => openModal(row, true, true),
      });
      actions[0].unshift({
        label: "Criar registro a partir de sessão",
        icon: "i-icon-park-outline-save-one",
        disabled: !userIsVerified.value,
        click: async () => openModal(row),
      });
    }
  }

  return actions;
};

const openModal = (
  timeRecord: TimeRecordLocal,
  isSync = false,
  isBind = false
) => {
  if (!timeRecord) return;

  editTimeRecordObject.value = timeRecordLocalToForm(
    { ...timeRecord, isSync, isBind },
    () => {
      timerStore.deleteTimeRecordLocal(timeRecord.localUuid, props.id);
      props.postTimePeriodCallback(timeRecord.code || "");
    }
  );

  modal.open = true;
};

const closeModal = () => {
  modal.open = false;

  setTimeout(() => {
    if (modal.open == false) {
      editTimeRecordObject.value = undefined;
    }
  }, 500);
};
</script>

<template>
  <UTable :columns="columns" :rows="timeRecords">
    <template #timePeriods-data="{ row }">
      <TimeRecordTableColTimePeriod
        :time-periods="(row as TimeRecordLocal).timePeriods"
        :label="timePeriodLabel((row as TimeRecordLocal).timePeriods.length)"
      />
    </template>

    <template #code-data="{ row }">
      {{ row.code || "-" }}
    </template>

    <template #actions-data="{ row }">
      <div class="flex justify-end">
        <UDropdown
          :items="items(row)"
          :ui="{
            width: 'max-w-80 w-auto',
          }"
        >
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
    :page="timer.page"
    :perPage="timerStore._perPage"
    :totalItems="timer.localRecords.length"
    :totalPages="totalPages"
    @update:page="(value) => (timer.page = value)"
    @update:perPage="(value) => (timerStore._perPage = value)"
  />

  <UModal v-model="modal.open" prevent-close>
    <TimeRecordFormCreateAndUpdate
      :edit-object="editTimeRecordObject"
      @close="closeModal"
    />
  </UModal>

  <GModalConfirm
    v-model:open="confirmDelete.open"
    :title="_$t('confirmDeleteLocalRecordMessage')"
    @confirm="deleteAction"
    @cancel="closeConfirmDeleteModal"
  />
</template>
