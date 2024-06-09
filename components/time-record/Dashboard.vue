<script lang="ts" setup>
import type { DeletePayload } from "./table/index.vue";

const modal = reactive({
  createOrUpdateTimeRecord: false,
  confirmDelete: {
    open: false,
    id: null as null | number,
    page: 1,
    perPage: 4,
  },
});

const timeRecordStore = useTimeRecordStore();
const editTimeRecordObject = ref<TimeRecordFormType | undefined>(undefined);
const router = useRouter();

const closeConfirmDeleteModal = () => {
  modal.confirmDelete.open = false;
  modal.confirmDelete.id = null;
};

const openConfirmDeleteModal = async (payload: DeletePayload) => {
  modal.confirmDelete.open = true;
  modal.confirmDelete.id = payload.id;
  modal.confirmDelete.page = payload.page;
  modal.confirmDelete.perPage = payload.perPage;
};

const access = (id: number) => {
  router.push(`/time-record/${id}`);
};

const closeModal = () => {
  modal.createOrUpdateTimeRecord = false;
  editTimeRecordObject.value = undefined;
};

const deleteTimeRecord = async () => {
  if (!modal.confirmDelete.id) return;

  try {
    await timeRecordStore.deleteTimeRecord(
      modal.confirmDelete.id,
      modal.confirmDelete.page,
      modal.confirmDelete.perPage
    );
    closeConfirmDeleteModal();
  } catch (error) {
    ErrorToast(error);
  }
};
</script>

<template>
  <div class="grid grid-cols-12 gap-5">
    <div class="col-span-full lg:col-span-8 overflow-auto">
      <TimeRecordTable
        @access="access"
        @create="modal.createOrUpdateTimeRecord = true"
        @delete="openConfirmDeleteModal"
      />
    </div>

    <div class="col-span-full lg:col-span-4">
      <h2 class="mb-5 text-2xl font-bold">Contador</h2>

      <TimerDefault />

      <h2 class="mb-5 mt-5 text-2xl font-bold">Registros Locais</h2>

      <UCard>
        <TimeRecordTableLocal />
      </UCard>
    </div>
  </div>

  <GModalConfirm
    v-model:open="modal.confirmDelete.open"
    text="Tem certeza que quer excluir esse registro?"
    @confirm="deleteTimeRecord"
    @cancel="closeConfirmDeleteModal"
  />

  <UModal v-model="modal.createOrUpdateTimeRecord" prevent-close>
    <TimeRecordFormCreateAndUpdate
      :edit-object="editTimeRecordObject"
      @close="closeModal"
    />
  </UModal>
</template>

