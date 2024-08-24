<script lang="ts" setup>
import type { DeletePayloadEvent } from "./table/index.vue";

const modal = reactive({
  createOrUpdateTimeRecord: false,
  confirmDelete: {
    open: false,
    id: null as null | number,
  },
});

const timeRecordStore = useTimeRecordStore();
const editTimeRecordObject = ref<TimeRecordForm | undefined>(undefined);
const router = useRouter();

const closeConfirmDeleteModal = () => {
  modal.confirmDelete.open = false;
  modal.confirmDelete.id = null;
};

const openConfirmDeleteModal = async (payload: DeletePayloadEvent) => {
  modal.confirmDelete.open = true;
  modal.confirmDelete.id = payload.id;
};

const access = (code: string) => {
  router.push({
    name: "time.record.page",
    params: { code },
  });
};

const closeModal = () => {
  modal.createOrUpdateTimeRecord = false;
  editTimeRecordObject.value = undefined;
};

const deleteFetch = ref(false);

const deleteTimeRecord = async () => {
  if (!modal.confirmDelete.id) return;

  deleteFetch.value = true;

  try {
    await timeRecordStore.deleteTimeRecord(modal.confirmDelete.id);
    closeConfirmDeleteModal();
  } catch (error) {
    ErrorToast(error);
  } finally {
    deleteFetch.value = false;
  }
};
</script>

<template>
  <div class="grid grid-cols-12 gap-5">
    <div class="col-span-full lg:col-span-12">
      <TimeRecordTable
        @access="access"
        @create="modal.createOrUpdateTimeRecord = true"
        @delete="openConfirmDeleteModal"
      />
    </div>
  </div>

  <GModalConfirm
    v-model:open="modal.confirmDelete.open"
    :title="$t('confirmDeleteTimeRecordMessage')"
    :isFetch="deleteFetch"
    @confirm="deleteTimeRecord"
    @cancel="closeConfirmDeleteModal"
  />

  <UModal v-model="modal.createOrUpdateTimeRecord" prevent-close>
    <TimeRecordFormCreateAndUpdate @close="closeModal" />
  </UModal>
</template>
