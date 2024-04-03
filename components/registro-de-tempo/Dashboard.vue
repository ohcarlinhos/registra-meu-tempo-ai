<script lang="ts" setup>
const modal = reactive({
  createOrUpdateRegistro: false,
  confirmDelete: {
    open: false,
    id: null as null | number,
  },
});

const registroStore = useRegistroDeTempoStore();
const editRegistroObject = ref<RegistroFormType | undefined>(undefined);

const closeConfirmDeleteModal = () => {
  modal.confirmDelete.open = false;
  modal.confirmDelete.id = null;
};

const openConfirmDeleteModal = async (id: number) => {
  modal.confirmDelete.open = true;
  modal.confirmDelete.id = id;
};

const openEditModal = (id: number) => {
  const registro = registroStore.findRegistroById(id);
  if (!registro) return;

  editRegistroObject.value = editRegistroObjectFactory(registro);
  modal.createOrUpdateRegistro = true;
};

const closeModal = () => {
  modal.createOrUpdateRegistro = false;
  editRegistroObject.value = undefined;
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
      icon="i-heroicons-pencil-square-20-solid"
      @click="modal.createOrUpdateRegistro = true"
    />
  </UContainer>

  <RegistroDeTempoTable
    @update="openEditModal"
    @delete="openConfirmDeleteModal"
  />

  <GModalConfirm
    v-model:open="modal.confirmDelete.open"
    text="Tem certeza que quer excluir esse registro?"
    @confirm="deleteRegistro"
    @cancel="closeConfirmDeleteModal"
  />

  <UModal v-model="modal.createOrUpdateRegistro" prevent-close>
    <RegistroDeTempoFormCreateAndUpdate
      :edit-object="editRegistroObject"
      @close="closeModal"
    />
  </UModal>
</template>

