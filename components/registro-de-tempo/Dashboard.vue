<script lang="ts" setup>
const modal = reactive({ createOrUpdateRegistro: false, confirmDelete: false });
const registroStore = useRegistroDeTempoStore();

const deleteRegistro = async (id: number) => {
  // modal.confirmDelete = true;
  try {
    await registroStore.deleteRegistro(id);
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
    @delete="deleteRegistro"
  />

  <GeneralModalConfirm v-model:open="modal.confirmDelete" />

  <UModal v-model="modal.createOrUpdateRegistro" prevent-close>
    <RegistroDeTempoFormCreateAndUpdate
      @close="modal.createOrUpdateRegistro = false"
    />
  </UModal>
</template>

<style></style>
