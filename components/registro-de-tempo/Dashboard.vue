<script lang="ts" setup>
const modal = reactive({
  createOrUpdateRegistro: false,
  confirmDelete: {
    open: false,
    id: null as null | number,
  },
});
const registroStore = useRegistroDeTempoStore();

const closeConfirmDeleteModal = () => {
  modal.confirmDelete.open = false;
  modal.confirmDelete.id = null;
};

const openConfirmDeleteModal = async (id: number) => {
  modal.confirmDelete.open = true;
  modal.confirmDelete.id = id;
};

const deleteRegistro = async () => {
  if (!modal.confirmDelete.id) return;

  try {
    await registroStore.deleteRegistro(modal.confirmDelete.id!);
    closeConfirmDeleteModal();
  } catch (error) {
    ErrorToast(error);
  }
};
</script>

<template>
  <UContainer
    :ui="{
      base: 'flex justify-end',
      padding: 'pb-6 px-0 lg:px-0 sm:px-0',
    }"
  >
    <UButton
      label="Registrar Tempo"
      @click="modal.createOrUpdateRegistro = true"
    />
  </UContainer>

  <RegistroDeTempoTable
    @update="modal.createOrUpdateRegistro = true"
    @delete="openConfirmDeleteModal"
  />

  <GeneralModalConfirm
    v-model:open="modal.confirmDelete.open"
    text="Tem certeza que quer excluir esse registro?"
    @confirm="deleteRegistro"
    @cancel="closeConfirmDeleteModal"
  />

  <UModal v-model="modal.createOrUpdateRegistro" prevent-close>
    <RegistroDeTempoFormCreateAndUpdate
      @close="modal.createOrUpdateRegistro = false"
    />
  </UModal>
</template>

<style></style>
