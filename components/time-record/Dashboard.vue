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

const edit = (id: number) => {
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
  <div class="flex gap-10">
    <div>
      <TimerDefault />

      <h2 class="mb-5 mt-5 text-2xl font-bold">Registros Locais</h2>

      <UCard>
        <TimeRecordTableLocal />
      </UCard>
    </div>

    <div class="flex-1">
      <UContainer
        :ui="{
          base: 'flex justify-between gap-10',
          padding: 'pb-6 px-0 lg:px-0 sm:px-0',
        }"
      >
        <h2 class="text-2xl font-bold">Registros de Tempo</h2>

        <UButton
          label="Registro Manual"
          icon="i-heroicons-pencil-square-20-solid"
          @click="modal.createOrUpdateTimeRecord = true"
        />
      </UContainer>
      <UCard>
        <TimeRecordTable @update="edit" @delete="openConfirmDeleteModal" />
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
