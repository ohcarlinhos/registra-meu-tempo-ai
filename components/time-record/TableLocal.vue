<script lang="ts" setup>
import { watch } from "vue";
import { useEventBus } from "@vueuse/core";
import { columns } from "./table-local/columns";

const timerStore = useTimerStore();

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

const timeRecords = computed<TimeRecordLocalTable[]>(() =>
  timerStore.getTimeRecords(props.id)
);

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

const bus = useEventBus<TimeRecordLocalTableBusEvent>(TRL_TABLE_BUS_NAME);

const handleWithBus = (event: TimeRecordLocalTableBusEvent) => {
  if (event.action == "delete") {
    openConfirmDeleteModal(event.data.localUuid, event.data.id);
  } else if (event.action == "sync") {
    openModal(event.data, true);
  } else if (event.action == "bind") {
    openModal(event.data, true, true);
  } else if (event.action == "createFrom") {
    openModal(event.data);
  }
};

bus.on(handleWithBus);

onBeforeUnmount(() => {
  bus.off(handleWithBus);
});
</script>

<template>
  <GDataTable :columns="columns" :data="timeRecords" />

  <GPaginationV2
    :page="timer.page"
    :per-page="timerStore._perPage"
    :total-pages="totalPages"
    :total-items="timer.localRecords.length"
    :per-page-list="[6]"
    hide-last-first
    hide-per-page
    total-label="Sessões"
    @update:page="(value) => (timer.page = parseInt(value))"
    @update:perPage="(value) => (timerStore._perPage = parseInt(value))"
  />

  <Dialog v-bind:open="modal.open" @update:open="!$event && closeModal()">
    <DialogContent @interact-outside="$event.preventDefault()">
      <DialogHeader>
        <DialogTitle> {{ _$t("task") }} </DialogTitle>

        <DialogDescription>
          {{ editTimeRecordObject?.code }}
        </DialogDescription>
      </DialogHeader>

      <TimeRecordFormCreateAndUpdate
        :edit-object="editTimeRecordObject"
        @close="closeModal"
      />
    </DialogContent>
  </Dialog>

  <GModalConfirm
    v-model:open="confirmDelete.open"
    :title="_$t('confirmDeleteLocalRecordMessage')"
    :description="_$t('warningLostTime')"
    @confirm="deleteAction"
    @cancel="closeConfirmDeleteModal"
  />
</template>
