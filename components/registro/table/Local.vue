<script lang="ts" setup>
const timerStore = useTimerStore();
const authStore = useAuthStore();

const modal = reactive({ open: false });

const confirmDelete = reactive({
  open: false,
  uuid: "",
});

const editRegistroObject = ref<RegistroFormType | undefined>(undefined);

const closeConfirmDeleteModal = () => {
  confirmDelete.open = false;
  confirmDelete.uuid = "";
};

const openConfirmDeleteModal = (uuid: string) => {
  confirmDelete.open = true;
  confirmDelete.uuid = uuid;
};

const deleteRegistro = () => {
  timerStore.deleteRegistro(confirmDelete.uuid);
  closeConfirmDeleteModal();
};

const columns = [
  { key: "registroDate", label: "Data" },
  { key: "periodos", label: "Períodos" },
  { key: "tempoFormatado", label: "Tempo" },
  { key: "actions" },
];

const items = (row: IRegistroLocal) => {
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

const openModal = (registro: IRegistroLocal) => {
  if (!registro) return;

  editRegistroObject.value = editRegistroObjectFactory(registro, () => {
    timerStore.deleteRegistro(registro.localUuid);
  });

  modal.open = true;
};

const closeModal = () => {
  modal.open = false;
  editRegistroObject.value = undefined;
};
</script>

<template>
  <UTable
    :ui="{ base: `bg-neutral-${isDark ? '900' : '100'} rounded-md` }"
    :columns="columns"
    :rows="timerStore.registros"
    class="pt-10"
  >
    <template #periodos-data="{ row }">
      <RegistroTableColPeriodos
        :periodos="(row as IRegistroLocal).periodos"
        :label="periodosLabel((row as IRegistroLocal).periodos.length)"
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

  <UModal v-model="modal.open" prevent-close>
    <RegistroFormCreateAndUpdate
      :edit-object="editRegistroObject"
      @close="closeModal"
    />
  </UModal>

  <GModalConfirm
    v-model:open="confirmDelete.open"
    text="Tem certeza que quer excluir esse registro?"
    @confirm="deleteRegistro"
    @cancel="closeConfirmDeleteModal"
  />
</template>
