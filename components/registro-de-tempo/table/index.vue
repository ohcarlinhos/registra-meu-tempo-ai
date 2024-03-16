<script lang="ts" setup>
const store = useRegistroDeTempoStore();
const emit = defineEmits<{
  update: [value: number];
  delete: [value: number];
}>();

const columns = [
  { key: "id", label: "Id" },
  { key: "titulo", label: "Título" },
  { key: "dataDoRegistro", label: "Data" },
  { key: "nomeDaCategoria", label: "Categoria" },
  { key: "tempoFormatado", label: "Tempo" },
  { key: "periodos", label: "Períodos" },
  { key: "actions" },
];

const items = (row: RegistroDeTempoType) => [
  [
    {
      label: "Editar",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => emit("delete", row.id!),
    },
    {
      label: "Apagar",
      icon: "i-heroicons-trash-20-solid",
      click: async () => emit("delete", row.id!),
    },
  ],
];

onMounted(async () => {
  await store.fetchRegistrosDeTempo();
});
</script>

<template>
  <UTable
    :ui="{ base: 'bg-neutral-900 rounded-md' }"
    :columns="columns"
    :rows="store.registrosDeTempo"
    :loading="store.fetching"
  >
    <template #periodos-data="{ row }">
      <RegistroDeTempoTableColPeriodos
        :periodos="(row as RegistroDeTempoType).periodos"
        :label="(row as RegistroDeTempoType).periodosCountText || '0'"
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
</template>
